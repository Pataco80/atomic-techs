import { render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { setup } from "../../test/setup";
import { StackCombobox } from "@app/studio/_components/stack-combobox";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";

// cmdk relies on ResizeObserver + scrollIntoView, neither implemented by jsdom.
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = () => undefined;
      unobserve = () => undefined;
      disconnect = () => undefined;
    },
  );
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

/** Minimal StackItemRecord fixtures (only the fields the combobox reads). */
function makeStack(id: string, name: string): StackItemRecord {
  return {
    id,
    name,
    iconSvg: "<svg />",
    validatedAt: new Date("2020-01-01"),
    featured: false,
    order: 0,
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2020-01-01"),
    deletedAt: null,
  };
}

const STACKS: StackItemRecord[] = [
  makeStack("1", "React"),
  makeStack("2", "Réseau"),
  makeStack("3", "Node.js"),
  makeStack("4", "TypeScript"),
];

/** Controlled harness so selection state updates like in the real form. */
function Harness({ initial = [] as string[] }) {
  const [ids, setIds] = useState<string[]>(initial);
  return (
    <StackCombobox stackItems={STACKS} selectedIds={ids} onChange={setIds} />
  );
}

describe("StackCombobox", () => {
  it("exposes WCAG combobox semantics", () => {
    render(<Harness />);
    const input = screen.getByRole("combobox");
    expect(input).not.toBeNull();
  });

  it("filters options accent-insensitively as the user types", async () => {
    const { user } = setup(<Harness />);
    const input = screen.getByRole("combobox");

    await user.type(input, "reseau");

    const list = screen.getByRole("listbox");
    expect(within(list).getByText("Réseau")).not.toBeNull();
    expect(within(list).queryByText("React")).toBeNull();
    expect(within(list).queryByText("Node.js")).toBeNull();
  });

  it("adds a stack on click and renders it as a removable chip", async () => {
    const { user } = setup(<Harness />);
    const input = screen.getByRole("combobox");

    await user.click(input);
    await user.click(screen.getByRole("option", { name: /react/i }));

    // chip is shown (its dedicated remove button exists)
    expect(
      screen.getByRole("button", { name: /retirer react/i }),
    ).not.toBeNull();
    // removing it via that button clears the chip
    await user.click(screen.getByRole("button", { name: /retirer react/i }));
    expect(screen.queryByRole("button", { name: /retirer react/i })).toBeNull();
  });

  it("adds the highlighted option on Enter", async () => {
    const { user } = setup(<Harness />);
    const input = screen.getByRole("combobox");

    await user.type(input, "type");
    await user.keyboard("{Enter}");

    expect(screen.getByText("TypeScript")).not.toBeNull();
  });

  it("never offers an already-selected stack (no duplicates)", async () => {
    const { user } = setup(<Harness initial={["1"]} />);
    const input = screen.getByRole("combobox");

    await user.click(input);
    const list = screen.getByRole("listbox");

    // "React" (id 1) is selected → not in the options list, only the others.
    expect(within(list).queryByRole("option", { name: /^react$/i })).toBeNull();
    expect(
      within(list).getByRole("option", { name: /node\.js/i }),
    ).not.toBeNull();
  });

  it("shows an empty message when nothing matches", async () => {
    const { user } = setup(<Harness />);
    const input = screen.getByRole("combobox");

    await user.type(input, "zzz-nomatch");

    expect(screen.getByText("Aucune techno")).not.toBeNull();
  });
});
