/**
 * Turns an arbitrary string into a URL-safe slug.
 *
 * Strips diacritics (é → e), lowercases, replaces every run of non
 * alphanumeric characters with a single hyphen, and trims leading/trailing
 * hyphens. Used to derive `Project.slug` / `ContentPage.slug` from a title.
 *
 * @example slugify("Été 2024 — Mon Projet!") // "ete-2024-mon-projet"
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
