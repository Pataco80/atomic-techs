import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { setup } from "../../../test/setup";
import { ListRow } from "@/components/ios";

/**
 * ListRow is the iOS "Settings" row. It must render as a static div by default,
 * switch to an interactive element (button / link) via `as`, expose a chevron on
 * navigable rows, and forward clicks.
 */
describe("ListRow", () => {
  it("renders a static div with title and subtitle by default", () => {
    const { container } = render(
      <ListRow title="Réglages" subtitle="Détails" />,
    );

    const row = container.querySelector('[data-slot="list-row"]');
    expect(row?.tagName).toBe("DIV");
    expect(screen.getByText("Réglages")).not.toBeNull();
    expect(screen.getByText("Détails")).not.toBeNull();
  });

  it("renders as a button and forwards clicks", async () => {
    const onClick = vi.fn();
    const { user } = setup(
      <ListRow as="button" title="Action" onClick={onClick} />,
    );

    await user.click(screen.getByRole("button", { name: /action/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows a trailing chevron when showChevron is set", () => {
    const { container } = render(
      <ListRow as="button" title="Naviguer" showChevron />,
    );

    // chevron-right glyph renders as an svg inside the row.
    const svgs = container.querySelectorAll('[data-slot="list-row"] svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
