import { RichTextRenderer } from "@/components/nowts/rich-text-renderer";
import { Typography } from "@/components/nowts/typography";
import { SectionTitle } from "@/components/shared/section-title";
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
    <SectionLayout variant="default" size="sm">
      <div className="flex flex-col gap-6">
        <SectionTitle
          as="h1"
          subtitle={subtitle}
          title={page?.title ?? fallbackTitle}
        />
        {page ? (
          <RichTextRenderer content={page.body as JSONContent | null} />
        ) : (
          <Typography variant="muted">
            Cette page n'a pas encore de contenu.
          </Typography>
        )}
      </div>
    </SectionLayout>
  );
}
