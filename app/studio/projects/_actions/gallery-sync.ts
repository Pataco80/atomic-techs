/**
 * Pure helpers for synchronising a project's gallery items, mirroring the
 * `ProjectStack` sync (deleteMany + recreate) with an explicit display order
 * plus best-effort Blob cleanup of removed images.
 */

/** Stamps each item with its array position as `order` (0-based). */
export const withOrder = <T>(items: T[]): (T & { order: number })[] =>
  items.map((item, order) => ({ ...item, order }));

/** Urls present in `prev` but no longer in `next` — the blobs to clean up. */
export const removedImageUrls = (prev: string[], next: string[]): string[] =>
  prev.filter((url) => !next.includes(url));
