/** Small blue technology pill. */
export function TechBadge({ name }: { name: string }) {
  return (
    <span className="bg-primary/15 text-primary inline-flex rounded-md px-2 py-1 text-sm font-medium">
      {name}
    </span>
  );
}
