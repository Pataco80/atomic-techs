type CareerLike = {
  startYear: number;
  startMonth: number;
  endYear?: number | null;
  endMonth?: number | null;
};

/**
 * Sorts career events for display, most recent first. Ongoing jobs (no
 * `endYear`) come first, then ended jobs by end date desc; ties broken by
 * start date desc. Returns a new array — the input is never mutated.
 */
export function sortCareerEventsChrono<T extends CareerLike>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const aEnd = a.endYear ?? null;
    const bEnd = b.endYear ?? null;
    if ((aEnd === null) !== (bEnd === null)) return aEnd === null ? -1 : 1;

    if (aEnd !== null && bEnd !== null) {
      const endDiff = bEnd - aEnd || (b.endMonth ?? 0) - (a.endMonth ?? 0);
      if (endDiff !== 0) return endDiff;
    }

    return b.startYear - a.startYear || b.startMonth - a.startMonth;
  });
}
