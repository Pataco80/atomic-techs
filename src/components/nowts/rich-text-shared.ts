import type { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * Minimal TipTap schema shared by BOTH the editor and the read-only renderer,
 * so stored JSON always parses against the same node/mark set.
 *
 * StarterKit v3 bundles Heading, Link and Underline — configured here, NOT
 * registered standalone (double registration throws). No image / table / code
 * block. Links are restricted to safe protocols, which keeps the renderer safe
 * by construction (no raw HTML, no dangerouslySetInnerHTML).
 */
export const richTextExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [3, 4, 5] },
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      protocols: ["http", "https", "mailto"],
    },
  }),
];
