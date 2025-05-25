"use client";
import "./tiptap.css";
import { cn } from "@/lib/utils";
import { ImageExtension } from "@/components/tiptap/extensions/image";
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder";
import SearchAndReplace from "@/components/tiptap/extensions/search-and-replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu";
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "@/components/tiptap/toolbars/editor-toolbar";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import { useEffect, useState } from "react";

import { createLowlight } from "lowlight";
import ts from "highlight.js/lib/languages/typescript";
import js from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import 'highlight.js/styles/a11y-dark.css';

// Create and configure lowlight instance
const lowlight = createLowlight();

// Register languages with lowlight
lowlight.register("ts", ts);
lowlight.register("js", js);
lowlight.register("html", html);
lowlight.register("css", css);

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
    codeBlock: false, // disable default code block
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case "heading":
          return `Heading ${node.attrs.level}`;
        case "detailsSummary":
          return "Section title";
        case "codeBlock":
          // never show the placeholder when editing code
          return "";
        default:
          return "Write, type '/' for commands";
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  ImageExtension,
  ImagePlaceholder,
  SearchAndReplace,
  Typography,
];

type RichTextEditorDemoProps = {
  content: string;
  fileHandle: FileSystemFileHandle | null; // file handle to save
  onSave?: () => void;
  onUpdateContent?: (content: string) => void;
  className?: string;
};

export function RichTextEditorDemo({
  content,
  fileHandle,
  onSave,
  onUpdateContent,
  className,
}: RichTextEditorDemoProps) {
  const editor = useEditor({
    extensions: extensions as Extension[],
    content,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdateContent?.(html);
    },
  });

  const handleSave = async () => {
    if (!fileHandle || !editor) return;
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(editor.getHTML());
      await writable.close();
      onSave?.();
    } catch (e) {
      alert("Failed to save file: " + (e instanceof Error ? e.message : e));
    }
  };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "relative max-h-[calc(100vh-1rem)] w-full overflow-hidden overflow-y-auto",
        className
      )}
    >
      <EditorToolbar
        editor={editor}
        handleSave={handleSave}
        fileHandle={fileHandle}
      />
      <FloatingToolbar editor={editor} />
      <TipTapFloatingMenu editor={editor} />
      <div className="flex gap-2">
        <ScrollWrapper className="h-[calc(100vh-6rem)] mt-2 w-[92%]">
          <EditorContent
            editor={editor}
            className=" min-h-full w-full cursor-text !p-0 sm:p-6 text-sm"
          />
        </ScrollWrapper>
        <ScrollWrapper className="h-[calc(100vh-6rem)] mt-2 w-[8%] text-[2px] ">
          <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
        </ScrollWrapper>
      </div>
    </div>
  );
}
