/**
 * Renders a schema.org JSON-LD payload. The data is built from our own DB
 * content (never user-supplied HTML), so serialising it into a script tag is safe.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
