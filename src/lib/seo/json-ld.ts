/**
 * Pure builders for schema.org JSON-LD structured data. They return plain
 * objects (serialised into a <script type="application/ld+json"> tag) and omit
 * absent optional fields so the markup stays clean.
 */

type PersonInput = {
  fullName?: string | null;
  headline?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
};

export function buildPersonJsonLd(
  person: PersonInput | null,
  url: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person?.fullName ?? "Portfolio",
    url,
    ...(person?.headline ? { jobTitle: person.headline } : {}),
    ...(person?.avatarUrl ? { image: person.avatarUrl } : {}),
    ...(person?.email ? { email: person.email } : {}),
  };
}

type ProjectInput = {
  title: string;
  longDescription?: string | null;
  imageUrl?: string | null;
};

export function buildProjectJsonLd(
  project: ProjectInput,
  url: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url,
    ...(project.longDescription
      ? { description: project.longDescription }
      : {}),
    ...(project.imageUrl ? { image: project.imageUrl } : {}),
  };
}
