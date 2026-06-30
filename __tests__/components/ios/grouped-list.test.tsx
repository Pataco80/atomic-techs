import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GroupedList } from "@/components/ios";

/**
 * GroupedList is the inset card that wraps rows. It renders an optional uppercase
 * header and footer around a rounded card surface, and draws hairline separators
 * between children via pseudo-elements (asserted indirectly through the card slot).
 */
describe("GroupedList", () => {
  it("renders header, footer and children inside a card surface", () => {
    const { container } = render(
      <GroupedList header="Projet" footer="Texte d'aide">
        <div>Row A</div>
        <div>Row B</div>
      </GroupedList>,
    );

    expect(screen.getByText("Projet")).not.toBeNull();
    expect(screen.getByText("Texte d'aide")).not.toBeNull();
    expect(screen.getByText("Row A")).not.toBeNull();
    expect(screen.getByText("Row B")).not.toBeNull();

    const card = container.querySelector('[data-slot="grouped-list"]');
    expect(card).not.toBeNull();
    expect(card?.className).toContain("rounded-xl");
    expect(card?.className).toContain("bg-ios-card");
  });

  it("omits header and footer when not provided", () => {
    const { container } = render(
      <GroupedList>
        <div>Only row</div>
      </GroupedList>,
    );

    expect(container.querySelector('[data-slot="section-header"]')).toBeNull();
    expect(container.querySelector('[data-slot="section-footer"]')).toBeNull();
  });
});
