"use client"

import { Button } from "@/components/ui/button"
import { X, File } from "lucide-react"
import type { FileNode } from "./file-explorer"

interface FileTabsProps {
  openFiles: FileNode[]
  activeFileId: string | null
  onFileSelect: (file: FileNode) => void
  onFileClose: (fileId: string) => void
}

export function FileTabs({ openFiles, activeFileId, onFileSelect, onFileClose }: FileTabsProps) {
  if (openFiles.length === 0) {
    return null
  }

  const getFileIcon = (file: FileNode) => {
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

    return <File className={`w-3 h-3 ${iconColor}`} />
  }

  return (
    <div className="flex bg-[#2d2d30] border-b border-[#3e3e42] overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`flex items-center gap-2 px-3 py-2 border-r border-[#3e3e42] cursor-pointer min-w-0 ${
            file.id === activeFileId ? "bg-[#1e1e1e] text-white" : "bg-[#2d2d30] text-gray-300 hover:bg-[#2a2d2e]"
          }`}
          onClick={() => onFileSelect(file)}
        >
          {getFileIcon(file)}
          <span className="text-sm truncate max-w-32">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onFileClose(file.id)
            }}
            className="h-4 w-4 p-0 text-gray-400 hover:text-white hover:bg-[#464647] ml-1"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
