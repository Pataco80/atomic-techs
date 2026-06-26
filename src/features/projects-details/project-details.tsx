import { SectionTitle } from "@/components/shared/section-title";
import { SectionLayout } from "@/features/landing/section-layout";
import { buttonVariants } from "@/components/ui/button";
import { TechBadge } from "@/features/knowtecks/tech-badge";
import { projectPlaceholder } from "@/features/projects/project-placeholder";
import { JsonLd } from "@/features/seo/json-ld";
import { buildProjectJsonLd } from "@/lib/seo/json-ld";
import { getProjectBySlug } from "@/query/portfolio/get-projects";
import { SiteConfig } from "@/site-config";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function ProjectDetails({ slug }: { slug: string }) {
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <SectionLayout variant="default" size="base">
      <article className="flex flex-col gap-8">
        <JsonLd
          data={buildProjectJsonLd(
            project,
            `${SiteConfig.prodUrl}/portfolio/${project.slug}`,
          )}
        />

        <Link
          href="/portfolio"
          className="text-muted-foreground hover:text-primary inline-flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Tous les projets
        </Link>

        <header className="flex flex-col gap-4">
          <SectionTitle as="h1" subtitle="projet" title={project.title} />
          {project.stacks.length > 0 ? (
            <ul className="flex list-none flex-wrap gap-x-2 gap-y-3">
              {project.stacks.map((s) => (
                <li key={s.stackItem.id}>
                  <TechBadge name={s.stackItem.name} />
                </li>
              ))}
            </ul>
          ) : null}
          {(project.liveUrl ?? project.githubUrl) ? (
            <div className="flex flex-wrap gap-2">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonVariants({ size: "sm" })}
                >
                  <ExternalLink className="size-4" />
                  Voir en ligne
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Github className="size-4" />
                  Code source
                </a>
              ) : null}
            </div>
          ) : null}
        </header>

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
  );
}
