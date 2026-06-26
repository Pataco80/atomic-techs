const PROJECT_PLACEHOLDERS = [
  "/images/placeholders/project-1.webp",
  "/images/placeholders/project-2.webp",
  "/images/placeholders/project-3.webp",
] as const;

/**
 * Stable placeholder image for a project with no uploaded image yet (Vercel Blob
 * not configured). Rotates deterministically by seed so each project keeps the
 * same placeholder.
 */
export function projectPlaceholder(seed: string): string {
  let hash = 0;
  for (const char of seed) {
    hash = (hash + char.charCodeAt(0)) % PROJECT_PLACEHOLDERS.length;
  }
  return PROJECT_PLACEHOLDERS[hash] ?? PROJECT_PLACEHOLDERS[0];
}
