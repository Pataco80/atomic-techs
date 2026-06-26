import { Link } from "@tiptap/extension-link";
import type { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * Minimal TipTap schema shared by BOTH the editor and the read-only renderer,
 * so stored JSON always parses against the same node/mark set.
 *
 * Link is the standalone `@tiptap/extension-link` (NOT the one bundled in
 * StarterKit v3, which here produced a broken `link` mark with no `href` and a
 * non-serialisable reference that crashed Prisma on save). Safe protocols only
 * keep the renderer safe by construction (no raw HTML, no dangerouslySetInnerHTML).
 */
export const richTextExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [3, 4, 5] },
    codeBlock: false,
    link: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    protocols: ["http", "https", "mailto"],
    HTMLAttributes: {
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    },
  }),
];
