import { slugify } from "@/lib/format/slugify";
import { describe, expect, it } from "vitest";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Mon Projet Genial")).toBe("mon-projet-genial");
  });

  it("strips diacritics", () => {
    expect(slugify("Été à Paris")).toBe("ete-a-paris");
    expect(slugify("Café & Thé")).toBe("cafe-the");
  });

  it("collapses runs of symbols/whitespace into a single hyphen", () => {
    expect(slugify("a / b \\ c")).toBe("a-b-c");
    expect(slugify("  Hello   World  ")).toBe("hello-world");
    expect(slugify("Next.js 16!!!")).toBe("next-js-16");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("---Hello---")).toBe("hello");
    expect(slugify("!!!")).toBe("");
  });

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});
