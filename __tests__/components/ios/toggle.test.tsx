import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { setup } from "../../../test/setup";
import { Toggle } from "@/components/ios";

/**
 * Toggle is a reskin of the Radix Switch. It must expose the switch role, reflect
 * the controlled `checked` state, and emit `onCheckedChange` on interaction so it
 * binds directly to TanStack Form field state.
 */
describe("Toggle", () => {
  it("reflects the checked state via aria", () => {
    setup(<Toggle checked aria-label="Mis en avant" />);

    const sw = screen.getByRole("switch", { name: "Mis en avant" });
    expect(sw.getAttribute("aria-checked")).toBe("true");
  });

  it("emits onCheckedChange when toggled", async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <Toggle checked={false} onCheckedChange={onChange} aria-label="Actif" />,
    );

    await user.click(screen.getByRole("switch", { name: "Actif" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
