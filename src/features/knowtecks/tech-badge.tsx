/** Pastille techno (style Hygraph : texte bleu clair sur fond bleu). */
export function TechBadge({ name }: { name: string }) {
  return (
    <span className="bg-blue-ribbon-700 text-blue-ribbon-200 inline-flex rounded-lg px-2 py-1 text-sm">
      {name}
    </span>
  );
}
