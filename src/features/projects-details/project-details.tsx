import { Typography } from "@/components/nowts/typography";
import { CircuitDivider } from "@/components/shared/circuit-divider";
import { PageIntro } from "@/components/shared/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { TechBadge } from "@/features/knowtecks/tech-badge";
import { SectionLayout } from "@/features/landing/section-layout";
import { projectPlaceholder } from "@/features/projects/project-placeholder";
import { JsonLd } from "@/features/seo/json-ld";
import { buildProjectJsonLd } from "@/lib/seo/json-ld";
import { getProjectBySlug } from "@/query/portfolio/get-projects";
import { SiteConfig } from "@/site-config";
import { Icon } from "@/components/shared/icons";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function ProjectDetails({ slug }: { slug: string }) {
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={buildProjectJsonLd(
          project,
          `${SiteConfig.prodUrl}/portfolio/${project.slug}`,
        )}
      />

      <PageIntro
        subtitle="projet"
        title={project.title}
        backHref="/portfolio"
        backLabel="Voir tous les projets"
      >
        <Typography
          as="p"
          variant="muted"
          className="max-w-[600px] text-center"
        >
          {project.longDescription}
        </Typography>
        {project.stacks.length > 0 ? (
          <ul className="flex max-w-[420px] list-none flex-wrap justify-center gap-2">
            {project.stacks.map((s) => (
              <li key={s.stackItem.id}>
                <TechBadge name={s.stackItem.name} />
              </li>
            ))}
          </ul>
        ) : null}
        {(project.liveUrl ?? project.githubUrl) ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={buttonVariants({ size: "lg" })}
              >
                <Icon name="globe" className="size-4" />
                Voir en ligne
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <Icon name="github" className="size-4" />
                Code source
              </a>
            ) : null}
          </div>
        ) : null}
      </PageIntro>
      <CircuitDivider variant="hero" className="bg-hero-portfolio" />
      <SectionLayout variant="default" glow size="sm">
        <article className="flex flex-col gap-8">
          <div className="bg-muted border-foreground/10 relative aspect-video w-full overflow-hidden rounded-lg border shadow-sm">
            <Image
              src={project.imageUrl ?? projectPlaceholder(project.id)}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 56rem, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {project.longDescription}
          </div>
        </article>
      </SectionLayout>
    </>
  );
}
