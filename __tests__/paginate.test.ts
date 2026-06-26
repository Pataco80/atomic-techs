import { getTotalPages, paginate } from "@/lib/format/paginate";
import { describe, expect, it } from "vitest";

describe("getTotalPages", () => {
  it("returns 0 when there is nothing", () => {
    expect(getTotalPages(0, 12)).toBe(0);
  });

  it("returns 1 for an exact single page", () => {
    expect(getTotalPages(12, 12)).toBe(1);
  });

  it("rounds up with a remainder", () => {
    expect(getTotalPages(13, 12)).toBe(2);
    expect(getTotalPages(25, 12)).toBe(3);
  });

  it("guards against a non-positive perPage", () => {
    expect(getTotalPages(10, 0)).toBe(0);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it("slices the requested page", () => {
    const r = paginate(items, 2, 12);
    expect(r.items).toHaveLength(12);
    expect(r.items[0]).toBe(12);
    expect(r.page).toBe(2);
    expect(r.totalPages).toBe(3);
    expect(r.total).toBe(25);
  });

  it("clamps a page above the maximum", () => {
    const r = paginate(items, 99, 12);
    expect(r.page).toBe(3);
    expect(r.items).toEqual([24]);
  });

  it("clamps a page below 1", () => {
    expect(paginate(items, 0, 12).page).toBe(1);
    expect(paginate(items, -5, 12).page).toBe(1);
  });

  it("handles an empty list", () => {
    const r = paginate<number>([], 1, 12);
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.totalPages).toBe(0);
  });
});
