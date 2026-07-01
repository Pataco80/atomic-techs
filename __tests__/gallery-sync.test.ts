import {
  removedImageUrls,
  withOrder,
} from "@app/studio/projects/_actions/gallery-sync";
import { describe, expect, it } from "vitest";

describe("withOrder", () => {
  it("stamps each item with its 0-based array position", () => {
    const result = withOrder([
      { imageUrl: "a", title: "A", shortDescription: "da" },
      { imageUrl: "b", title: "B", shortDescription: "db" },
      { imageUrl: "c", title: "C", shortDescription: "dc" },
    ]);

    expect(result).toEqual([
      { imageUrl: "a", title: "A", shortDescription: "da", order: 0 },
      { imageUrl: "b", title: "B", shortDescription: "db", order: 1 },
      { imageUrl: "c", title: "C", shortDescription: "dc", order: 2 },
    ]);
  });

  it("returns an empty list unchanged", () => {
    expect(withOrder([])).toEqual([]);
  });

  it("preserves existing fields and does not mutate the input", () => {
    const input = [{ imageUrl: "x", title: "X", shortDescription: "dx" }];
    const result = withOrder(input);

    expect(result[0]).toMatchObject({ imageUrl: "x", order: 0 });
    expect(input[0]).not.toHaveProperty("order");
  });
});

describe("removedImageUrls", () => {
  it("returns urls present in prev but absent from next", () => {
    expect(removedImageUrls(["a", "b", "c"], ["a", "c"])).toEqual(["b"]);
  });

  it("returns an empty list when nothing was removed", () => {
    expect(removedImageUrls(["a", "b"], ["a", "b", "c"])).toEqual([]);
  });

  it("returns every url when next is empty", () => {
    expect(removedImageUrls(["a", "b"], [])).toEqual(["a", "b"]);
  });

  it("returns an empty list when prev is empty", () => {
    expect(removedImageUrls([], ["a"])).toEqual([]);
  });

  it("keeps duplicates from prev that are absent from next", () => {
    expect(removedImageUrls(["a", "a", "b"], ["b"])).toEqual(["a", "a"]);
  });
});
