import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { get, set } from "idb-keyval";

export type FileNode = {
  type: "file";
  content: string;
  handle: FileSystemFileHandle;
  name: string;
};

export type FolderNode = {
  type: "folder";
  children: {
    [name: string]: FileNode | FolderNode;
  };
  handle: FileSystemDirectoryHandle;
};

interface FilesContextProps {
  loadFiles: (dirHandle: FileSystemDirectoryHandle, basePath?: string) => Promise<void>;
  fileTree: FolderNode | null;
  folderHandle: FileSystemDirectoryHandle | null;
  setFolderHandle: (handle: FileSystemDirectoryHandle | null) => void;
  files: { handle: FileSystemFileHandle; name: string; content: string }[];
  setFiles: (
    files: { handle: FileSystemFileHandle; name: string; content: string }[]
  ) => void;
  error: string | null;
  selectedFile: {
    handle: FileSystemFileHandle;
    name: string;
    content: string;
  } | null;
  fileContent: string;
  setFileContent: (content: string) => void;
  pickFolder: () => void;
  saveFile: () => void;
  deleteFile: (fileName: string) => void;
  createFileAtPath: (path: string) => void;
  createFolderAtPath: (path: string) => void;
  selectFile: (file: {
    handle: FileSystemFileHandle;
    name: string;
    content: string;
  }) => void;
  refreshFolder: () => Promise<void>;
}

const HANDLE_KEY = "directory-handle";

// Permission check helper
async function verifyPermission(
  fileHandle: FileSystemHandle,
  readWrite = false
) {
  const options: any = readWrite ? { mode: "readwrite" } : {};
  if ((await (fileHandle as any).queryPermission(options)) === "granted") {
    return true;
  }
  if ((await (fileHandle as any).requestPermission(options)) === "granted") {
    return true;
  }
  return false;
}

const FilesContext = createContext<FilesContextProps | undefined>(undefined);

export const useFilesContext = (): FilesContextProps => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFilesContext must be used within a FilesProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const FilesProvider = ({ children }: Props) => {
  const [folderHandle, setFolderHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<
    { handle: FileSystemFileHandle; name: string; content: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    handle: FileSystemFileHandle;
    name: string;
    content: string;
  } | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileTree, setFileTree] = useState<FolderNode | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const storedHandle = await get<FileSystemDirectoryHandle>(HANDLE_KEY);
        if (storedHandle) {
          const hasPermission = await verifyPermission(storedHandle, true);
          if (hasPermission) {
            setFolderHandle(storedHandle);
            await loadFiles(storedHandle);
            return;
          }
        }
      } catch (e: any) {
        console.warn("Failed to load stored folder handle:", e.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (folderHandle) {
      loadTree(folderHandle).then(setFileTree).catch(console.error);
    }
  }, [folderHandle]);

  const loadFiles = async (
    dirHandle: FileSystemDirectoryHandle,
    basePath = ""
  ) => {
    const fileEntries: {
      handle: FileSystemFileHandle;
      name: string;
      content: string;
    }[] = [];

    const walkDirectory = async (
      handle: FileSystemDirectoryHandle,
      path: string
    ) => {
      for await (const [name, entry] of (
        handle as any
      ).entries() as AsyncIterable<[string, FileSystemHandle]>) {
        const currentPath = path ? `${path}/${name}` : name;

        if (entry.kind === "file") {
          const file = await (entry as FileSystemFileHandle).getFile();
          const content = await file.text();

          fileEntries.push({
            handle: entry as FileSystemFileHandle,
            name: currentPath, // full path from root
            content,
          });
        } else if (entry.kind === "directory") {
          await walkDirectory(entry as FileSystemDirectoryHandle, currentPath);
        }
      }
    };

    await walkDirectory(dirHandle, basePath);
    setFiles(fileEntries);
  };

  const loadTree = async (
    dirHandle: FileSystemDirectoryHandle
  ): Promise<FolderNode> => {
    const node: FolderNode = {
      type: "folder",
      handle: dirHandle,
      children: {},
    };

    for await (const [name, entry] of (
      dirHandle as any
    ).entries() as AsyncIterable<[string, FileSystemHandle]>) {
      if (entry.kind === "file") {
        const fileHandle = entry as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        const content = await file.text();

        node.children[name] = {
          type: "file",
          handle: fileHandle,
          content,
          name,
        };
      } else if (entry.kind === "directory") {
        const childFolderHandle = entry as FileSystemDirectoryHandle;
        node.children[name] = await loadTree(childFolderHandle);
      }
    }

    return node;
  };

  const pickFolder = async () => {
    try {
      const handle = await (window as any).showDirectoryPicker();
      const hasPermission = await verifyPermission(handle, true);
      if (!hasPermission) {
        setError("Permission denied for folder");
        return;
      }
      setFolderHandle(handle);
      await loadFiles(handle);
      await set(HANDLE_KEY, handle); // Save handle to IndexedDB
      setError(null);
    } catch (e: any) {
      setError(e.message || "Folder access cancelled or failed");
    }
  };

  const selectFile = (file: {
    handle: FileSystemFileHandle;
    name: string;
    content: string;
  }) => {
    setSelectedFile(file);
    setFileContent(file.content);
  };

  const saveFile = async () => {
    if (!selectedFile) return;

    try {
      const writable = await selectedFile.handle.createWritable();
      await writable.write(fileContent);
      await writable.close();

      // Update files array
      setFiles((prev) =>
        prev.map((f) =>
          f.name === selectedFile.name ? { ...f, content: fileContent } : f
        )
      );

      // Update fileTree
      setFileTree((prev) => {
        if (!prev) return null;

        const updateNode = (node: FolderNode): FolderNode => {
          const newChildren = { ...node.children };

          for (const [name, child] of Object.entries(node.children)) {
            if (child.type === "file" && child.name === selectedFile.name) {
              newChildren[name] = {
                ...child,
                content: fileContent,
              };
            } else if (child.type === "folder") {
              newChildren[name] = updateNode(child);
            }
          }

          return {
            ...node,
            children: newChildren,
          };
        };

        return updateNode(prev);
      });

      // Update selectedFile
      setSelectedFile((prev) =>
        prev ? { ...prev, content: fileContent } : null
      );

      alert("File saved successfully!");
    } catch (e: any) {
      setError(e.message || "Failed to save file");
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!folderHandle) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${filePath}"?`
    );
    if (!confirmDelete) return;

    try {
      const parts = filePath.split("/").filter(Boolean);
      const fileName = parts.pop(); // target file/folder name
      if (!fileName) return;

      // Traverse to the parent folder
      let currentDir: FileSystemDirectoryHandle = folderHandle;
      for (const part of parts) {
        currentDir = await currentDir.getDirectoryHandle(part, {
          create: false,
        });
      }

      await currentDir.removeEntry(fileName, { recursive: true });

      // Refresh both files and fileTree
      await loadFiles(folderHandle);
      const newTree = await loadTree(folderHandle);
      setFileTree(newTree);

      // Clear selected file if it was deleted
      if (selectedFile?.name === filePath) {
        setSelectedFile(null);
        setFileContent("");
      }

      alert(`"${filePath}" deleted successfully.`);
    } catch (e: any) {
      setError(e.message || `Failed to delete "${filePath}".`);
    }
  };

  const createFileAtPath = async (path: string) => {
    if (!folderHandle) return;

    const parts = path.split("/").filter(Boolean);
    const fileName = parts.pop();
    if (!fileName) {
      setError("Invalid file name.");
      return;
    }

    try {
      // Traverse through folders and create them if needed
      let currentDir = folderHandle;
      for (const part of parts) {
        currentDir = await currentDir.getDirectoryHandle(part, {
          create: true,
        });
      }

      // Create the file
      const newFileHandle = await currentDir.getFileHandle(fileName, {
        create: true,
      });

      // Optional: Write initial content
      const writable = await newFileHandle.createWritable();
      await writable.write(""); // Default empty
      await writable.close();

      // Refresh both files and fileTree
      await loadFiles(folderHandle);
      const newTree = await loadTree(folderHandle);
      setFileTree(newTree);

      alert(`"${path}" created successfully.`);
    } catch (e: any) {
      setError(e.message || `Failed to create file at "${path}".`);
    }
  };

  const createFolderAtPath = async (path: string) => {
    if (!folderHandle) return;

    const parts = path.split("/").filter(Boolean);

    try {
      let currentDir = folderHandle;
      for (const part of parts) {
        currentDir = await currentDir.getDirectoryHandle(part, {
          create: true,
        });
      }

      // Refresh both files and fileTree
      await loadFiles(folderHandle);
      const newTree = await loadTree(folderHandle);
      setFileTree(newTree);

      alert(`Folder "${path}" created successfully.`);
    } catch (e: any) {
      setError(e.message || `Failed to create folder at "${path}".`);
    }
  };

  const refreshFolder = async () => {
    if (!folderHandle) return;
    
    try {
      await loadFiles(folderHandle);
      const newTree = await loadTree(folderHandle);
      setFileTree(newTree);
    } catch (e: any) {
      setError(e.message || "Failed to refresh folder");
    }
  };

  return (
    <FilesContext.Provider
      value={{
        folderHandle,
        setFolderHandle,
        files,
        setFiles,
        error,
        selectedFile,
        fileContent,
        setFileContent,
        pickFolder,
        saveFile,
        deleteFile,
        createFileAtPath,
        createFolderAtPath,
        selectFile,
        fileTree,
        refreshFolder,
        loadFiles
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};
