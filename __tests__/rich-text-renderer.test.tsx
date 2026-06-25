import { screen, waitFor } from "@testing-library/react";
import type { JSONContent } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { RichTextRenderer } from "../src/components/nowts/rich-text-renderer";
import { setup } from "../test/setup";

/**
 * The renderer turns stored TipTap JSON into read-only HTML. It is the trust
 * boundary for user-authored content, so these tests assert that (a) the
 * restricted schema actually renders the expected nodes/marks and (b) empty
 * input mounts without throwing.
 */
const sampleDoc: JSONContent = {
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
        { type: "text", text: "Un paragraphe avec " },
        { type: "text", marks: [{ type: "bold" }], text: "gras" },
        { type: "text", text: " et " },
        { type: "text", marks: [{ type: "italic" }], text: "italique" },
        { type: "text", text: "." },
      ],
    },
  ],
};

describe("RichTextRenderer", () => {
  it("renders headings and inline marks from stored JSON", async () => {
    setup(<RichTextRenderer content={sampleDoc} />);

    // useEditor mounts asynchronously (immediatelyRender: false), so wait for it.
    const heading = await screen.findByText("Titre de section", undefined, {
      timeout: 5000,
    });
    expect(heading.tagName).toBe("H3");

    const bold = screen.getByText("gras");
    expect(bold.tagName).toBe("STRONG");

    const italic = screen.getByText("italique");
    expect(italic.tagName).toBe("EM");
  });

  it("mounts an editable=false surface for empty content without throwing", async () => {
    const { container } = setup(<RichTextRenderer content={null} />);

    await waitFor(
      () => {
        const surface = container.querySelector(".typography");
        expect(surface).not.toBeNull();
        expect(surface?.getAttribute("contenteditable")).toBe("false");
      },
      { timeout: 5000 },
    );
  });
});
