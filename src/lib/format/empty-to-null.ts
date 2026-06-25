/**
 * Normalises an optional text input: trims it, and turns empty strings (or
 * null/undefined) into `null` so optional DB columns stay clean rather than
 * storing empty strings.
 */
export function emptyToNull(value?: string | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
