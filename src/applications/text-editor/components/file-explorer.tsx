"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Folder, FolderOpen, File, Plus, FolderPlus, Trash2, Edit3, ChevronRight, ChevronDown } from "lucide-react"

export interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  language?: string
  children?: FileNode[]
  isOpen?: boolean
  parentId?: string
}

interface FileExplorerProps {
  files: FileNode[]
  activeFileId: string | null
  onFileSelect: (file: FileNode) => void
  onFileCreate: (parentId: string | null, name: string, type: "file" | "folder") => void
  onFileDelete: (fileId: string) => void
  onFileRename: (fileId: string, newName: string) => void
  onFolderToggle: (folderId: string) => void
}

export function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFolderToggle,
}: FileExplorerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const getFileIcon = (file: FileNode) => {
    if (file.type === "folder") {
      return file.isOpen ? (
        <FolderOpen className="w-4 h-4 text-blue-400" />
      ) : (
        <Folder className="w-4 h-4 text-blue-400" />
      )
    }

    // Enhanced file icons based on extension
    const extension = file.name.split(".").pop()?.toLowerCase()
    const iconColor =
      {
        // JavaScript/TypeScript
        js: "text-yellow-400",
        mjs: "text-yellow-400",
        cjs: "text-yellow-400",
        jsx: "text-blue-400",
        ts: "text-blue-500",
        tsx: "text-blue-500",
        mts: "text-blue-500",
        cts: "text-blue-500",

        // Web
        html: "text-orange-400",
        htm: "text-orange-400",
        css: "text-blue-300",
        scss: "text-pink-400",
        sass: "text-pink-400",
        less: "text-blue-400",

        // Data
        json: "text-yellow-300",
        jsonc: "text-yellow-300",
        json5: "text-yellow-300",
        xml: "text-orange-300",
        yaml: "text-purple-300",
        yml: "text-purple-300",
        toml: "text-orange-300",
        ini: "text-gray-400",

        // Languages
        py: "text-green-400",
        pyw: "text-green-400",
        pyi: "text-green-400",
        java: "text-red-400",
        cpp: "text-blue-600",
        cc: "text-blue-600",
        cxx: "text-blue-600",
        c: "text-blue-600",
        h: "text-blue-600",
        hpp: "text-blue-600",
        cs: "text-purple-500",
        php: "text-purple-400",
        go: "text-cyan-400",
        rs: "text-orange-500",
        rb: "text-red-500",
        swift: "text-orange-400",
        kt: "text-purple-400",
        dart: "text-blue-400",

        // Scripts
        sh: "text-green-300",
        bash: "text-green-300",
        zsh: "text-green-300",
        fish: "text-green-300",
        ps1: "text-blue-400",

        // Frameworks
        vue: "text-green-500",
        svelte: "text-orange-500",

        // Others
        sql: "text-blue-300",
        graphql: "text-pink-500",
        gql: "text-pink-500",
        prisma: "text-indigo-400",
        dockerfile: "text-blue-500",
        md: "text-gray-300",
        mdx: "text-gray-300",
        txt: "text-gray-400",
        log: "text-gray-500",
        env: "text-yellow-500",
      }[extension || ""] || "text-gray-300"

    return <File className={`w-4 h-4 ${iconColor}`} />
  }

  const handleRename = (fileId: string, currentName: string) => {
    setEditingId(fileId)
    setEditingName(currentName)
  }

  const handleRenameSubmit = (fileId: string) => {
    if (editingName.trim()) {
      onFileRename(fileId, editingName.trim())
    }
    setEditingId(null)
    setEditingName("")
  }

  const renderFileNode = (file: FileNode, depth = 0) => {
    const isActive = file.id === activeFileId
    const isEditing = editingId === file.id

    return (
      <div key={file.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] ${
                isActive ? "bg-[#094771]" : ""
              }`}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => {
                if (file.type === "folder") {
                  onFolderToggle(file.id)
                } else {
                  onFileSelect(file)
                }
              }}
            >
              {file.type === "folder" && (
                <div className="w-4 h-4 flex items-center justify-center">
                  {file.isOpen ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              )}
              {getFileIcon(file)}
              {isEditing ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRenameSubmit(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit(file.id)
                    } else if (e.key === "Escape") {
                      setEditingId(null)
                      setEditingName("")
                    }
                  }}
                  className="h-6 text-xs bg-[#3c3c3c] border-[#464647] text-white"
                  autoFocus
                />
              ) : (
                <span className="text-sm text-gray-200 truncate">{file.name}</span>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-[#3c3c3c] border-[#464647]">
            <ContextMenuItem
              onClick={() =>
                onFileCreate(file.type === "folder" ? file.id : file.parentId || null, "new-file.txt", "file")
              }
              className="text-white hover:bg-[#094771] focus:bg-[#094771]"
            >
              <File className="w-4 h-4 mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() =>
                onFileCreate(file.type === "folder" ? file.id : file.parentId || null, "new-folder", "folder")
              }
              className="text-white hover:bg-[#094771] focus:bg-[#094771]"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-[#464647]" />
            <ContextMenuItem
              onClick={() => handleRename(file.id, file.name)}
              className="text-white hover:bg-[#094771] focus:bg-[#094771]"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => onFileDelete(file.id)}
              className="text-red-400 hover:bg-red-600 focus:bg-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {file.type === "folder" && file.isOpen && file.children && (
          <div>{file.children.map((child) => renderFileNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-[#3e3e42]">
        <span className="text-sm font-medium text-gray-200">EXPLORER</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFileCreate(null, "new-file.txt", "file")}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#2a2d2e]"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFileCreate(null, "new-folder", "folder")}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-[#2a2d2e]"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No files yet. Right-click to create files and folders.
          </div>
        ) : (
          <div className="py-1">{files.map((file) => renderFileNode(file))}</div>
        )}
      </div>
    </div>
  )
}
