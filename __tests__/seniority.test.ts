import { computeSeniority } from "@/lib/format/seniority";
import { describe, expect, it } from "vitest";

describe("computeSeniority", () => {
  const ref = new Date("2024-06-15");

  it("formats years and months together", () => {
    expect(computeSeniority(new Date("2022-03-15"), ref)).toBe("2 ans 3 mois");
  });

  it("uses the singular 'an' for exactly one year", () => {
    expect(computeSeniority(new Date("2023-06-15"), ref)).toBe("1 an");
  });

  it("omits the year part when under a year", () => {
    expect(computeSeniority(new Date("2024-05-15"), ref)).toBe("1 mois");
  });

  it("omits the months part on a whole number of years", () => {
    expect(computeSeniority(new Date("2022-06-15"), ref)).toBe("2 ans");
  });

  it("returns '< 1 mois' below one month", () => {
    expect(computeSeniority(new Date("2024-06-01"), ref)).toBe("< 1 mois");
  });

  it("clamps future dates to '< 1 mois'", () => {
    expect(computeSeniority(new Date("2025-01-01"), ref)).toBe("< 1 mois");
  });
});
