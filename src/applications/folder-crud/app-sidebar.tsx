import * as React from "react";
import {
  ChevronRight,
  Delete,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  RefreshCcw,
  RefreshCcwDot,
  RotateCcw,
  Trash,
  Trash2,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  useFilesContext,
  type FileNode,
  type FolderNode,
} from "./FilesContext";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import { Button } from "@/components/ui/button";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { fileTree, createFolderAtPath, createFileAtPath, refreshFolder } =
    useFilesContext();
  const [isCreating, setIsCreating] = React.useState<"file" | "folder" | null>(
    null
  );
  const [newName, setNewName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreate = (type: "file" | "folder") => {
    setIsCreating(type);
    setNewName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (isCreating === "file") {
      createFileAtPath(newName.trim());
    } else {
      createFolderAtPath(newName.trim());
    }
    setIsCreating(null);
  };

  const handleBlur = () => {
    if (newName.trim()) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else {
      setIsCreating(null);
    }
  };

  const data = {
    changes: [
      {
        file: "Jella Komal",
        state: "M",
      },
    ],
    tree: [Object.entries(fileTree?.children ?? {})],
  };

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.changes.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="text-primary">
                    <File />
                    {item.file}
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="bg-primary text-background">
                    {item.state}
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <ScrollWrapper className="h-[calc(100vh-10rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="flex w-full items-center justify-between">
                <span>Files</span>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCreate("folder")}
                  >
                    <FolderPlus className="w-4 h-4 cursor-pointer text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCreate("file")}
                  >
                    <FilePlus className="w-4 h-4 cursor-pointer text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => refreshFolder()}
                  >
                    <RotateCcw className="w-4 h-4 cursor-pointer text-primary" />
                  </Button>
                </div>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isCreating && (
                  <SidebarMenuItem>
                    <form
                      onSubmit={handleSubmit}
                      className="w-full flex items-center gap-1"
                    >
                      {isCreating === "folder" && (
                        <Folder className="size-4 text-primary" />
                      )}
                      {isCreating === "file" && (
                        <File className="size-4 text-primary" />
                      )}
                      <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleBlur}
                        placeholder={`New ${isCreating} name...`}
                        className="w-full bg-transparent px-2 py-1 text-sm outline-none border"
                        autoComplete="off"
                      />
                    </form>
                  </SidebarMenuItem>
                )}
                {fileTree &&
                  Object.entries(fileTree.children).map(([name, node]) => (
                    <Tree key={name} name={name} node={node} />
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollWrapper>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({
  name,
  node,
  path = "",
}: {
  name: string;
  node: FileNode | FolderNode;
  path?: string;
}) {
  const { selectFile, createFileAtPath, createFolderAtPath, deleteFile } =
    useFilesContext();
  const fullPath = path ? `${path}/${name}` : name;
  const [open, setOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState<"file" | "folder" | null>(
    null
  );
  const [newName, setNewName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCreate = (type: "file" | "folder") => {
    setIsCreating(type);
    setNewName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPath = `${fullPath}/${newName.trim()}`;
    if (isCreating === "file") {
      createFileAtPath(newPath);
    } else {
      createFolderAtPath(newPath);
    }
    setIsCreating(null);
  };

  const handleBlur = () => {
    if (newName.trim()) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    } else {
      setIsCreating(null);
    }
  };

  if (node.type === "file") {
    return (
      <SidebarMenuItem className="">
        <SidebarMenuButton
          onClick={() => selectFile(node)}
          className="group/item flex items-center justify-between w-full text-xs py-0"
        >
          <div className="flex items-center gap-1.5">
            <File className="size-4 text-primary" />
            {name}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // prevent toggling the folder
              deleteFile(fullPath); // your delete handler
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuItem>
          <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          >
            <CollapsibleTrigger asChild key={name} className="">
              <SidebarMenuButton
                className="group/item flex items-center justify-between w-full text-xs py-0"
                key={name}
              >
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="transition-transform size-4" />
                  <Folder className="size-4 text-primary" />
                  {name}
                </div>
                <Trash2
                  key={name}
                  className="w-4 h-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent toggling the folder
                    deleteFile(fullPath); // your delete handler
                  }}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent className="py-0">
              <SidebarMenuSub className="py-0">
                {Object.entries(node.children).map(([childName, childNode]) => (
                  <Tree
                    key={childName}
                    name={childName}
                    node={childNode}
                    path={fullPath}
                  />
                ))}
                {isCreating && (
                  <SidebarMenuItem>
                    <form onSubmit={handleSubmit} className="w-full">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleBlur}
                        placeholder={`New ${isCreating} name...`}
                        className="w-full bg-transparent px-2 py-1 text-sm outline-none"
                        autoComplete="off"
                      />
                    </form>
                  </SidebarMenuItem>
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-40">
        <ContextMenuItem
          onClick={() => handleCreate("file")}
          className="border-b border-border"
        >
          New File
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => handleCreate("folder")}
          className="border-b border-border"
        >
          New Folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
