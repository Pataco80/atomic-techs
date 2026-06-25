import { sortCareerEventsChrono } from "@/lib/format/career-order";
import { describe, expect, it } from "vitest";

type Event = {
  id: string;
  startYear: number;
  startMonth: number;
  endYear?: number | null;
  endMonth?: number | null;
};

describe("sortCareerEventsChrono", () => {
  it("puts ongoing jobs (no endYear) before ended ones", () => {
    const ended: Event = {
      id: "ended",
      startYear: 2023,
      startMonth: 1,
      endYear: 2024,
      endMonth: 1,
    };
    const ongoing: Event = {
      id: "ongoing",
      startYear: 2020,
      startMonth: 1,
      endYear: null,
    };
    const sorted = sortCareerEventsChrono([ended, ongoing]);
    expect(sorted.map((e) => e.id)).toEqual(["ongoing", "ended"]);
  });

  it("orders ongoing jobs by start date desc", () => {
    const older: Event = {
      id: "older",
      startYear: 2021,
      startMonth: 6,
      endYear: null,
    };
    const newer: Event = {
      id: "newer",
      startYear: 2023,
      startMonth: 2,
      endYear: null,
    };
    const sorted = sortCareerEventsChrono([older, newer]);
    expect(sorted.map((e) => e.id)).toEqual(["newer", "older"]);
  });

  it("orders ended jobs by end date desc, then start date desc", () => {
    const a: Event = {
      id: "a",
      startYear: 2018,
      startMonth: 1,
      endYear: 2020,
      endMonth: 6,
    };
    const b: Event = {
      id: "b",
      startYear: 2019,
      startMonth: 1,
      endYear: 2022,
      endMonth: 3,
    };
    const c: Event = {
      id: "c",
      startYear: 2015,
      startMonth: 1,
      endYear: 2022,
      endMonth: 11,
    };
    const sorted = sortCareerEventsChrono([a, b, c]);
    expect(sorted.map((e) => e.id)).toEqual(["c", "b", "a"]);
  });

  it("does not mutate the input array", () => {
    const input: Event[] = [
      { id: "x", startYear: 2020, startMonth: 1, endYear: 2021, endMonth: 1 },
      { id: "y", startYear: 2022, startMonth: 1, endYear: null },
    ];
    const snapshot = input.map((e) => e.id);
    sortCareerEventsChrono(input);
    expect(input.map((e) => e.id)).toEqual(snapshot);
  });
});
