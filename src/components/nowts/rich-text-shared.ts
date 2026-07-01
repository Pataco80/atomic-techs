import { Link } from "@tiptap/extension-link";
import type { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const LINK_HTML_ATTRIBUTES = {
  rel: "noopener noreferrer nofollow",
  target: "_blank",
  class: "cursor-pointer",
};

/**
 * Minimal TipTap schema shared by BOTH the editor and the read-only renderer,
 * so stored JSON always parses against the same node/mark set.
 *
 * Link is the standalone `@tiptap/extension-link` (NOT the one bundled in
 * StarterKit v3, which here produced a broken `link` mark with no `href` and a
 * non-serialisable reference that crashed Prisma on save). Safe protocols only
 * keep the renderer safe by construction (no raw HTML, no dangerouslySetInnerHTML).
 *
 * `openOnClick` is the only behavioural difference between the two: the editor
 * keeps it OFF (clicking a link while editing places the caret), while the
 * read-only renderer turns it ON so public links actually open on click.
 */
function buildRichTextExtensions(openOnClick: boolean): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [3, 4, 5] },
      codeBlock: false,
      link: false,
    }),
    Link.configure({
      openOnClick,
      autolink: true,
      protocols: ["http", "https", "mailto"],
      HTMLAttributes: LINK_HTML_ATTRIBUTES,
    }),
  ];
}

/** Editor extensions — links do not navigate on click (caret placement). */
export const richTextExtensions: Extensions = buildRichTextExtensions(false);

/** Read-only renderer extensions — links open on click (public site). */
export const richTextRendererExtensions: Extensions =
  buildRichTextExtensions(true);
