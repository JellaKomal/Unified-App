"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Code, Download, Copy, Save } from "lucide-react"
import { FileExplorer, type FileNode } from "./file-explorer"
import { FileTabs } from "./file-tabs"

// Monaco Editor types
declare global {
  interface Window {
    monaco: any
    require: any
  }
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "typescriptreact", label: "TypeScript React" },
  { value: "javascriptreact", label: "JavaScript React" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "sass", label: "Sass" },
  { value: "less", label: "Less" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "sql", label: "SQL" },
  { value: "php", label: "PHP" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "dart", label: "Dart" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "shell", label: "Shell Script" },
  { value: "powershell", label: "PowerShell" },
  { value: "dockerfile", label: "Dockerfile" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "graphql", label: "GraphQL" },
  { value: "prisma", label: "Prisma" },
  { value: "toml", label: "TOML" },
  { value: "ini", label: "INI" },
  { value: "plaintext", label: "Plain Text" },
]

const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase()
  const extensionMap: { [key: string]: string } = {
    // JavaScript/TypeScript
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    jsx: "javascriptreact",
    ts: "typescript",
    mts: "typescript",
    cts: "typescript",
    tsx: "typescriptreact",

    // Python
    py: "python",
    pyw: "python",
    pyi: "python",

    // Web Technologies
    html: "html",
    htm: "html",
    xhtml: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",

    // Data formats
    json: "json",
    jsonc: "json",
    json5: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    ini: "ini",

    // Other languages
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    c: "cpp",
    h: "cpp",
    hpp: "cpp",
    cs: "csharp",
    php: "php",
    go: "go",
    rs: "rust",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    dart: "dart",
    sql: "sql",

    // Scripts and configs
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    fish: "shell",
    ps1: "powershell",
    dockerfile: "dockerfile",

    // Frameworks
    vue: "vue",
    svelte: "svelte",

    // Others
    graphql: "graphql",
    gql: "graphql",
    prisma: "prisma",
    md: "markdown",
    mdx: "markdown",
    txt: "plaintext",
    log: "plaintext",
    env: "plaintext",
  }
  return extensionMap[extension || ""] || "plaintext"
}

const DEFAULT_CODE_SAMPLES = {
  javascript: `// Welcome to the Code Editor!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

  typescript: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(userData: Partial<User>): User {
  return {
    id: Math.random(),
    name: userData.name || "Anonymous",
    email: userData.email || "user@example.com"
  };
}

const user = createUser({ name: "John Doe" });`,

  python: `# Python Example
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(numbers))`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <main>
        <p>This is a sample HTML document.</p>
    </main>
</body>
</html>`,

  css: `/* CSS Example */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}`,

  json: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "nodemon": "^2.0.15",
    "jest": "^27.5.1"
  }
}`,
}

export function CodeEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // File management state
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: "1",
      name: "main.js",
      type: "file",
      content: DEFAULT_CODE_SAMPLES.javascript,
      language: "javascript",
    },
  ])
  const [openFiles, setOpenFiles] = useState<FileNode[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(2)

  useEffect(() => {
    const loadMonaco = async () => {
      if (typeof window !== "undefined") {
        // Load Monaco Editor from CDN
        const script = document.createElement("script")
        script.src = "https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js"
        script.onload = () => {
          window.require.config({
            paths: {
              vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs",
            },
          })

          window.require(["vs/editor/editor.main"], () => {
            if (editorRef.current) {
              // Define custom shadcn-inspired theme
              window.monaco.editor.defineTheme("shadcn-theme", {
                base: "vs",
                inherit: true,
                rules: [
                  { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                  { token: "keyword", foreground: "7c3aed", fontStyle: "bold" },
                  { token: "string", foreground: "059669" },
                  { token: "number", foreground: "dc2626" },
                  { token: "regexp", foreground: "ea580c" },
                  { token: "type", foreground: "2563eb" },
                  { token: "class", foreground: "7c2d12" },
                  { token: "function", foreground: "9333ea" },
                  { token: "variable", foreground: "374151" },
                  { token: "constant", foreground: "dc2626" },
                ],
                colors: {
                  "editor.background": "#ffffff",
                  "editor.foreground": "#1f2937",
                  "editorLineNumber.foreground": "#9ca3af",
                  "editorLineNumber.activeForeground": "#374151",
                  "editor.selectionBackground": "#dbeafe",
                  "editor.inactiveSelectionBackground": "#f3f4f6",
                  "editorCursor.foreground": "#374151",
                  "editor.findMatchBackground": "#fef3c7",
                  "editor.findMatchHighlightBackground": "#fef9e7",
                  "editorWidget.background": "#f9fafb",
                  "editorWidget.border": "#e5e7eb",
                  "editorSuggestWidget.background": "#ffffff",
                  "editorSuggestWidget.border": "#e5e7eb",
                  "editorSuggestWidget.selectedBackground": "#f3f4f6",
                  "editorHoverWidget.background": "#ffffff",
                  "editorHoverWidget.border": "#e5e7eb",
                  "scrollbarSlider.background": "#e5e7eb",
                  "scrollbarSlider.hoverBackground": "#d1d5db",
                  "scrollbarSlider.activeBackground": "#9ca3af",
                },
              })

              // Define dark theme as well
              window.monaco.editor.defineTheme("shadcn-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                  { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                  { token: "keyword", foreground: "a855f7", fontStyle: "bold" },
                  { token: "string", foreground: "10b981" },
                  { token: "number", foreground: "f87171" },
                  { token: "regexp", foreground: "fb923c" },
                  { token: "type", foreground: "60a5fa" },
                  { token: "class", foreground: "fbbf24" },
                  { token: "function", foreground: "c084fc" },
                  { token: "variable", foreground: "e5e7eb" },
                  { token: "constant", foreground: "f87171" },
                ],
                colors: {
                  "editor.background": "#0f172a",
                  "editor.foreground": "#e2e8f0",
                  "editorLineNumber.foreground": "#64748b",
                  "editorLineNumber.activeForeground": "#cbd5e1",
                  "editor.selectionBackground": "#1e40af",
                  "editor.inactiveSelectionBackground": "#334155",
                  "editorCursor.foreground": "#e2e8f0",
                  "editor.findMatchBackground": "#fbbf24",
                  "editor.findMatchHighlightBackground": "#92400e",
                  "editorWidget.background": "#1e293b",
                  "editorWidget.border": "#334155",
                  "editorSuggestWidget.background": "#1e293b",
                  "editorSuggestWidget.border": "#334155",
                  "editorSuggestWidget.selectedBackground": "#334155",
                  "editorHoverWidget.background": "#1e293b",
                  "editorHoverWidget.border": "#334155",
                  "scrollbarSlider.background": "#334155",
                  "scrollbarSlider.hoverBackground": "#475569",
                  "scrollbarSlider.activeBackground": "#64748b",
                },
              })

              // Register custom snippets
              const registerSnippets = () => {
                // React Functional Component Export
                window.monaco.languages.registerCompletionItemProvider("typescriptreact", {
                  provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position)
                    const range = {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: word.startColumn,
                      endColumn: word.endColumn,
                    }

                    const filename = activeFile?.name.split(".")[0] || "Component"
                    const componentName = filename.charAt(0).toUpperCase() + filename.slice(1)

                    return {
                      suggestions: [
                        {
                          label: "rfce",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "React Functional Component Export",
                          insertText: `import React from 'react'

interface ${componentName}Props {
  
}

const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div>
      <h1>${componentName}</h1>
    </div>
  )
}

export default ${componentName}`,
                          range: range,
                        },
                        {
                          label: "rfc",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "React Functional Component",
                          insertText: `import React from 'react'

const ${componentName} = () => {
  return (
    <div>
      <h1>${componentName}</h1>
    </div>
  )
}

export default ${componentName}`,
                          range: range,
                        },
                        {
                          label: "useState",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "React useState Hook",
                          insertText:
                            "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue})",
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                        {
                          label: "useEffect",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "React useEffect Hook",
                          insertText: `useEffect(() => {
  \${1:// effect logic}
  
  return () => {
    \${2:// cleanup}
  }
}, [\${3:dependencies}])`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                      ],
                    }
                  },
                })

                // JavaScript/TypeScript snippets
                window.monaco.languages.registerCompletionItemProvider("javascript", {
                  provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position)
                    const range = {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: word.startColumn,
                      endColumn: word.endColumn,
                    }

                    return {
                      suggestions: [
                        {
                          label: "log",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "Console log",
                          insertText: `console.log(\${1:value})`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                        {
                          label: "func",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "Function declaration",
                          insertText: `function \${1:functionName}(\${2:params}) {
  \${3:// function body}
}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                        {
                          label: "arrow",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "Arrow function",
                          insertText: `const \${1:functionName} = (\${2:params}) => {
  \${3:// function body}
}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                        {
                          label: "try",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "Try-catch block",
                          insertText: `try {
  \${1:// try block}
} catch (error) {
  \${2:console.error(error)}
}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                      ],
                    }
                  },
                })

                // TypeScript specific snippets
                window.monaco.languages.registerCompletionItemProvider("typescript", {
                  provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position)
                    const range = {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: word.startColumn,
                      endColumn: word.endColumn,
                    }

                    return {
                      suggestions: [
                        {
                          label: "interface",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "TypeScript interface",
                          insertText: `interface \${1:InterfaceName} {
  \${2:property}: \${3:type}
}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                        {
                          label: "type",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "TypeScript type alias",
                          insertText: `type \${1:TypeName} = \${2:type}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                      ],
                    }
                  },
                })

                // Python snippets
                window.monaco.languages.registerCompletionItemProvider("python", {
                  provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position)
                    const range = {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: word.startColumn,
                      endColumn: word.endColumn,
                    }

                    return {
                      suggestions: [
                        {
                          label: "def",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "Python function",
                          insertText: `def \${1:function_name}(\${2:params}):
    \${3:pass}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                        {
                          label: "class",
                          kind: window.monaco.languages.CompletionItemKind.Snippet,
                          documentation: "Python class",
                          insertText: `class \${1:ClassName}:
    def __init__(self\${2:, params}):
        \${3:pass}`,
                          insertTextRules: window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          range: range,
                        },
                      ],
                    }
                  },
                })
              }

              const editor = window.monaco.editor.create(editorRef.current, {
                value: "",
                language: "javascript",
                theme: "shadcn-theme",
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: {
                  enabled: false
                },
                wordWrap: "on",
                formatOnPaste: true,
                formatOnType: true,
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoIndent: "full",
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                  showFunctions: true,
                  showConstructors: true,
                  showFields: true,
                  showVariables: true,
                  showClasses: true,
                  showStructs: true,
                  showInterfaces: true,
                  showModules: true,
                  showProperties: true,
                  showEvents: true,
                  showOperators: true,
                  showUnits: true,
                  showValues: true,
                  showConstants: true,
                  showEnums: true,
                  showEnumMembers: true,
                  showColors: true,
                  showFiles: true,
                  showReferences: true,
                  showFolders: true,
                  showTypeParameters: true,
                  showUsers: true,
                  showIssues: true,
                },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
                parameterHints: { enabled: true },
                hover: { enabled: true },
                contextmenu: true,
                mouseWheelZoom: true,
                cursorBlinking: "blink",
                cursorStyle: "line",
                renderWhitespace: "selection",
                renderControlCharacters: true,
                fontLigatures: true,
                smoothScrolling: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                },
              })

              // Register snippets after editor creation
              registerSnippets()

              // Listen for content changes
              editor.onDidChangeModelContent(() => {
                const content = editor.getValue()
                if (activeFileId) {
                  updateFileContent(activeFileId, content)
                }
              })

              monacoRef.current = editor
              setIsLoading(false)

              // Open the first file
              if (files.length > 0) {
                handleFileSelect(files[0])
              }
            }
          })
        }
        document.head.appendChild(script)
      }
    }

    loadMonaco()

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose()
      }
    }
  }, [])

  const findFileById = (fileId: string, fileList: FileNode[] = files): FileNode | null => {
    for (const file of fileList) {
      if (file.id === fileId) {
        return file
      }
      if (file.children) {
        const found = findFileById(fileId, file.children)
        if (found) return found
      }
    }
    return null
  }

  const updateFileContent = (fileId: string, content: string) => {
    const updateFiles = (fileList: FileNode[]): FileNode[] => {
      return fileList.map((file) => {
        if (file.id === fileId) {
          return { ...file, content }
        }
        if (file.children) {
          return { ...file, children: updateFiles(file.children) }
        }
        return file
      })
    }

    setFiles(updateFiles(files))
    setOpenFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, content } : file)))
  }

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "folder") return

    setActiveFileId(file.id)

    // Add to open files if not already open
    if (!openFiles.find((f) => f.id === file.id)) {
      setOpenFiles((prev) => [...prev, file])
    }

    // Update editor content and language
    if (monacoRef.current) {
      monacoRef.current.setValue(file.content || "")
      const language = getLanguageFromExtension(file.name)
      const model = monacoRef.current.getModel()
      window.monaco.editor.setModelLanguage(model, language)
    }
  }

  const handleFileClose = (fileId: string) => {
    setOpenFiles((prev) => prev.filter((f) => f.id !== fileId))

    if (activeFileId === fileId) {
      const remainingFiles = openFiles.filter((f) => f.id !== fileId)
      if (remainingFiles.length > 0) {
        handleFileSelect(remainingFiles[remainingFiles.length - 1])
      } else {
        setActiveFileId(null)
        if (monacoRef.current) {
          monacoRef.current.setValue("")
        }
      }
    }
  }

  const handleFileCreate = (parentId: string | null, name: string, type: "file" | "folder") => {
    const newFile: FileNode = {
      id: nextId.toString(),
      name,
      type,
      content: type === "file" ? "" : undefined,
      language: type === "file" ? getLanguageFromExtension(name) : undefined,
      children: type === "folder" ? [] : undefined,
      isOpen: type === "folder" ? false : undefined,
      parentId: parentId || undefined,
    }

    setNextId((prev) => prev + 1)

    if (parentId) {
      const updateFiles = (fileList: FileNode[]): FileNode[] => {
        return fileList.map((file) => {
          if (file.id === parentId && file.type === "folder") {
            return {
              ...file,
              children: [...(file.children || []), newFile],
              isOpen: true,
            }
          }
          if (file.children) {
            return { ...file, children: updateFiles(file.children) }
          }
          return file
        })
      }
      setFiles(updateFiles(files))
    } else {
      setFiles((prev) => [...prev, newFile])
    }

    // If it's a file, open it immediately
    if (type === "file") {
      setTimeout(() => handleFileSelect(newFile), 100)
    }
  }

  const handleFileDelete = (fileId: string) => {
    const deleteFromFiles = (fileList: FileNode[]): FileNode[] => {
      return fileList.filter((file) => {
        if (file.id === fileId) {
          return false
        }
        if (file.children) {
          file.children = deleteFromFiles(file.children)
        }
        return true
      })
    }

    setFiles(deleteFromFiles(files))

    // Close the file if it's open
    if (openFiles.find((f) => f.id === fileId)) {
      handleFileClose(fileId)
    }
  }

  const handleFileRename = (fileId: string, newName: string) => {
    const updateFiles = (fileList: FileNode[]): FileNode[] => {
      return fileList.map((file) => {
        if (file.id === fileId) {
          const updatedFile = {
            ...file,
            name: newName,
            language: file.type === "file" ? getLanguageFromExtension(newName) : file.language,
          }

          // Update language in editor if this file is active
          if (activeFileId === fileId && monacoRef.current && file.type === "file") {
            const language = getLanguageFromExtension(newName)
            const model = monacoRef.current.getModel()
            window.monaco.editor.setModelLanguage(model, language)
          }

          return updatedFile
        }
        if (file.children) {
          return { ...file, children: updateFiles(file.children) }
        }
        return file
      })
    }

    setFiles(updateFiles(files))
    setOpenFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, name: newName } : file)))
  }

  const handleFolderToggle = (folderId: string) => {
    const updateFiles = (fileList: FileNode[]): FileNode[] => {
      return fileList.map((file) => {
        if (file.id === folderId && file.type === "folder") {
          return { ...file, isOpen: !file.isOpen }
        }
        if (file.children) {
          return { ...file, children: updateFiles(file.children) }
        }
        return file
      })
    }

    setFiles(updateFiles(files))
  }

  const formatCode = () => {
    if (monacoRef.current) {
      monacoRef.current.getAction("editor.action.formatDocument").run()
    }
  }

  const copyCode = async () => {
    if (monacoRef.current) {
      const content = monacoRef.current.getValue()
      await navigator.clipboard.writeText(content)
    }
  }

  const downloadCode = () => {
    if (!activeFileId) return

    const activeFile = findFileById(activeFileId)
    if (!activeFile) return

    const content = monacoRef.current?.getValue() || ""
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = activeFile.name
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const saveFile = () => {
    // In a real application, this would save to a backend
    console.log("File saved!")
  }

  const activeFile = activeFileId ? findFileById(activeFileId) : null

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      {/* File Explorer */}
      <FileExplorer
        files={files}
        activeFileId={activeFileId}
        onFileSelect={handleFileSelect}
        onFileCreate={handleFileCreate}
        onFileDelete={handleFileDelete}
        onFileRename={handleFileRename}
        onFolderToggle={handleFolderToggle}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#2d2d30] border-b border-[#3e3e42]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <h1 className="text-lg font-semibold text-white">Code Editor</h1>
            </div>

            {activeFile && (
              <div className="text-sm text-gray-300">
                {activeFile.name} -{" "}
                {SUPPORTED_LANGUAGES.find((l) => l.value === getLanguageFromExtension(activeFile.name))?.label}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newTheme = isDarkMode ? "shadcn-theme" : "shadcn-dark"
                setIsDarkMode(!isDarkMode)
                if (monacoRef.current) {
                  window.monaco.editor.setTheme(newTheme)
                }
              }}
              className="text-white hover:bg-[#094771]"
            >
              {isDarkMode ? "🌞" : "🌙"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={saveFile}
              className="text-white hover:bg-[#094771]"
              disabled={!activeFile}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={formatCode}
              className="text-white hover:bg-[#094771]"
              disabled={isLoading || !activeFile}
            >
              <Code className="w-4 h-4 mr-2" />
              Format
            </Button>

            <Separator orientation="vertical" className="h-6 bg-[#464647]" />

            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="text-white hover:bg-[#094771]"
              disabled={!activeFile}
            >
              <Copy className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={downloadCode}
              className="text-white hover:bg-[#094771]"
              disabled={!activeFile}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* File Tabs */}
        <FileTabs
          openFiles={openFiles}
          activeFileId={activeFileId}
          onFileSelect={handleFileSelect}
          onFileClose={handleFileClose}
        />

        {/* Editor */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
              <div className="text-white">Loading editor...</div>
            </div>
          )}
          {!activeFile && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]">
              <div className="text-center text-gray-400">
                <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No file selected</p>
                <p className="text-sm">Create a new file or select an existing one from the explorer</p>
              </div>
            </div>
          )}
          <div ref={editorRef} className="w-full h-full" />
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#007acc] text-white text-sm">
          <div className="flex items-center gap-4">
            {activeFile && (
              <>
                <span>File: {activeFile.name}</span>
                <span>
                  Language:{" "}
                  {SUPPORTED_LANGUAGES.find((l) => l.value === getLanguageFromExtension(activeFile.name))?.label}
                </span>
                <span>Lines: {(activeFile.content || "").split("\n").length}</span>
                <span>Characters: {(activeFile.content || "").length}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>LF</span>
            <span>{openFiles.length} files open</span>
          </div>
        </div>
      </div>
    </div>
  )
}
