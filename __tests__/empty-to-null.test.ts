import { emptyToNull } from "@/lib/format/empty-to-null";
import { describe, expect, it } from "vitest";

describe("emptyToNull", () => {
  it("returns null for null and undefined", () => {
    expect(emptyToNull(null)).toBeNull();
    expect(emptyToNull(undefined)).toBeNull();
  });

  it("returns null for empty or whitespace-only strings", () => {
    expect(emptyToNull("")).toBeNull();
    expect(emptyToNull("   ")).toBeNull();
    expect(emptyToNull("\t\n")).toBeNull();
  });

  it("trims and returns non-empty strings", () => {
    expect(emptyToNull("hello")).toBe("hello");
    expect(emptyToNull("  spaced  ")).toBe("spaced");
  });
});
