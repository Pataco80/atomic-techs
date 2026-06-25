"use client";

import { cn } from "@/lib/utils";
import type { JSONContent } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { richTextExtensions } from "./rich-text-shared";

type RichTextRendererProps = {
  content?: JSONContent | null;
  className?: string;
};

/**
 * Read-only renderer for stored TipTap JSON. Safe by construction: content is
 * parsed through the restricted schema (no raw HTML, no dangerouslySetInnerHTML)
 * and links are limited to safe protocols by `richTextExtensions`.
 */
export function RichTextRenderer({
  content,
  className,
}: RichTextRendererProps) {
  const editor = useEditor({
    editable: false,
    extensions: richTextExtensions,
    content: content ?? null,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: cn("typography max-w-none", className) },
    },
  });

  // Reflect live content changes (e.g. the demo) in the read-only view.
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
