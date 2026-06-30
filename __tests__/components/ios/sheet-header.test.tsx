import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IosSheetHeader } from "@/components/ios";

/**
 * IosSheetHeader is the sticky form-sheet navigation bar that replaces a bottom
 * submit button: a cancel action on the left, the centered title, and the
 * validate action on the right — like the iPhone Calendar/Reminders sheets.
 */
describe("IosSheetHeader", () => {
  it("renders the centered title and both navigation slots", () => {
    const { container } = render(
      <IosSheetHeader
        title="Nouveau projet"
        leading={<button type="button">Annuler</button>}
        trailing={<button type="submit">Enregistrer</button>}
      />,
    );

    const header = container.querySelector('[data-slot="ios-sheet-header"]');
    expect(header).not.toBeNull();
    expect(header?.className).toContain("sticky");
    expect(screen.getByText("Nouveau projet")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Annuler" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Enregistrer" })).not.toBeNull();
  });
});
