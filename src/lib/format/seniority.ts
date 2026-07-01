import dayjs from "dayjs";

/**
 * Human-readable seniority (in French) elapsed since `validatedAt`, the date a
 * stack item was mastered. `now` is injectable so the result is deterministic
 * in tests. Future dates clamp to zero.
 *
 * @example computeSeniority(new Date("2022-03-15"), new Date("2024-06-15")) // "2 ans 3 mois"
 */
export function computeSeniority(
  validatedAt: Date,
  now: Date = new Date(),
): string {
  const totalMonths = Math.max(0, dayjs(now).diff(dayjs(validatedAt), "month"));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) return "< 1 mois";

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mois`);
  return parts.join(" ");
}
