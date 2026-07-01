import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { setup } from "../../../test/setup";
import { SegmentedControl } from "@/components/ios";

const SEGMENTS = [
  { value: "person", label: "Profil" },
  { value: "org", label: "Organisation" },
];

/**
 * SegmentedControl is the iOS pill tab switcher used by the About back-office. It
 * exposes a tablist, marks the active segment with aria-selected, and reports the
 * chosen value through onValueChange.
 */
describe("SegmentedControl", () => {
  it("marks the active segment as selected", () => {
    setup(
      <SegmentedControl
        value="person"
        onValueChange={() => undefined}
        segments={SEGMENTS}
        aria-label="Sections"
      />,
    );

    const selected = screen.getByRole("tab", { name: "Profil" });
    expect(selected.getAttribute("aria-selected")).toBe("true");

    const other = screen.getByRole("tab", { name: "Organisation" });
    expect(other.getAttribute("aria-selected")).toBe("false");
  });

  it("emits onValueChange with the clicked segment value", async () => {
    const onValueChange = vi.fn();
    const { user } = setup(
      <SegmentedControl
        value="person"
        onValueChange={onValueChange}
        segments={SEGMENTS}
        aria-label="Sections"
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Organisation" }));
    expect(onValueChange).toHaveBeenCalledWith("org");
  });
});
