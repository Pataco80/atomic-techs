import { RichTextRenderer } from "@/components/nowts/rich-text-renderer";
import { Typography } from "@/components/nowts/typography";
import { CircuitDivider } from "@/components/shared/circuit-divider";
import { PageIntro } from "@/components/shared/page-intro";
import { SectionLayout } from "@/features/landing/section-layout";
import { getContentPageBySlug } from "@/query/portfolio/get-about";
import type { JSONContent } from "@tiptap/react";

export async function ContentPageView({
  slug,
  fallbackTitle,
  subtitle,
}: {
  slug: string;
  fallbackTitle: string;
  subtitle: string;
}) {
  const page = await getContentPageBySlug(slug);

  return (
    <>
      <PageIntro
        subtitle={subtitle}
        title={page?.title ?? fallbackTitle}
        backHref="/"
        className="h-100"
      />
      <CircuitDivider variant="hero" className="bg-hero-portfolio" />
      <SectionLayout variant="default" size="sm">
        {page ? (
          <RichTextRenderer content={page.body as JSONContent | null} />
        ) : (
          <Typography variant="muted">
            Cette page n'a pas encore de contenu.
          </Typography>
        )}
      </SectionLayout>
    </>
  );
}
