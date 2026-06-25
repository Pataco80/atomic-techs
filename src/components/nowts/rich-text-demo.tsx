"use client";

import { Typography } from "@/components/nowts/typography";
import type { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";
import { RichTextRenderer } from "./rich-text-renderer";

const INITIAL_DOC: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Titre de section" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Texte avec " },
        { type: "text", marks: [{ type: "bold" }], text: "gras" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "italic" }], text: "italique" },
        { type: "text", text: " et " },
        { type: "text", marks: [{ type: "underline" }], text: "souligné" },
        { type: "text", text: "." },
      ],
    },
  ],
};

/**
 * Side-by-side editor + read-only renderer over a shared JSON document.
 * Acceptance "test field" for spec 01; real CRUD wiring lands in spec 02.
 */
export function RichTextDemo() {
  const [doc, setDoc] = useState<JSONContent>(INITIAL_DOC);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Typography variant="muted">Éditeur</Typography>
        <RichTextEditor value={doc} onChange={setDoc} />
      </div>
      <div className="flex flex-col gap-2">
        <Typography variant="muted">Rendu (lecture seule)</Typography>
        <div className="border-input bg-background min-h-40 rounded-md border px-3 py-2">
          <RichTextRenderer content={doc} />
        </div>
      </div>
    </div>
  );
}
