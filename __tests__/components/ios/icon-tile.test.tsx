import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconTile } from "@/components/ios";

/**
 * IconTile is the small tinted square that fronts every grouped-list row. It must
 * render the shared Icon (never a raw lucide import) and let callers override the
 * tint via className while keeping the base size/shape utilities.
 */
describe("IconTile", () => {
  it("renders a tinted square containing an svg glyph", () => {
    const { container } = render(<IconTile name="home" />);

    const tile = container.querySelector('[data-slot="icon-tile"]');
    expect(tile).not.toBeNull();
    expect(tile?.className).toContain("size-7");
    expect(tile?.className).toContain("rounded-md");
    expect(tile?.querySelector("svg")).not.toBeNull();
  });

  it("applies a custom tint while preserving base utilities", () => {
    const { container } = render(
      <IconTile name="analytics" className="bg-emerald-500" />,
    );

    const tile = container.querySelector('[data-slot="icon-tile"]');
    expect(tile?.className).toContain("bg-emerald-500");
    expect(tile?.className).toContain("text-white");
  });
});
