/**
 * Pure pagination helpers (no framework deps) so they can be unit-tested and
 * reused by any list page.
 */

/** Number of pages for `total` items at `perPage`; 0 when there is nothing. */
export function getTotalPages(total: number, perPage: number): number {
  if (perPage <= 0 || total <= 0) return 0;
  return Math.ceil(total / perPage);
}

export type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
};

/**
 * Slices `items` for the given 1-based `page`, clamping out-of-range pages to a
 * valid one (so a bad `?page=` query never crashes or shows a blank grid).
 */
export function paginate<T>(
  items: T[],
  page: number,
  perPage: number,
): Paginated<T> {
  const total = items.length;
  const totalPages = getTotalPages(total, perPage);
  const maxPage = Math.max(1, totalPages);
  const clamped = Math.min(Math.max(1, Math.floor(page) || 1), maxPage);
  const start = (clamped - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: clamped,
    totalPages,
    total,
  };
}
