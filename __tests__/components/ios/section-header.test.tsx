import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionFooter, SectionHeader } from "@/components/ios";

/**
 * SectionHeader / SectionFooter are the small secondary-label captions that sit
 * above and below grouped-list cards. They must render their text and expose the
 * data-slot used by GroupedList tests.
 */
describe("SectionHeader / SectionFooter", () => {
  it("renders an uppercase header caption", () => {
    const { container } = render(<SectionHeader>Identité</SectionHeader>);

    const header = container.querySelector('[data-slot="section-header"]');
    expect(header).not.toBeNull();
    expect(header?.className).toContain("uppercase");
    expect(screen.getByText("Identité")).not.toBeNull();
  });

  it("renders footer help text", () => {
    const { container } = render(<SectionFooter>Texte d'aide</SectionFooter>);

    expect(
      container.querySelector('[data-slot="section-footer"]'),
    ).not.toBeNull();
    expect(screen.getByText("Texte d'aide")).not.toBeNull();
  });
});
