import { SectionTitle } from "@/components/shared/section-title";
import { SectionLayout } from "@/features/landing/section-layout";
import { TechBadge } from "@/features/knowtecks/tech-badge";
import { projectPlaceholder } from "@/features/projects/project-placeholder";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function HighlightCard({ project }: { project: ProjectWithStacks }) {
  return (
    <article className="flex flex-col gap-6 lg:flex-row lg:gap-12">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg lg:w-[420px] lg:shrink-0">
        <Image
          src={project.imageUrl ?? projectPlaceholder(project.id)}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 lg:py-2">
        <h3 className="text-xl font-medium">{project.title}</h3>
        {project.longDescription ? (
          <p className="text-muted-foreground line-clamp-4">
            {project.longDescription}
          </p>
        ) : null}
        {project.stacks.length > 0 ? (
          <ul className="flex list-none flex-wrap gap-x-2 gap-y-3">
            {project.stacks.map((s) => (
              <li key={s.stackItem.id}>
                <TechBadge name={s.stackItem.name} />
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={`/portfolio/${project.slug}`}
          className="text-primary inline-flex w-fit items-center gap-1 font-medium hover:underline"
        >
          Voir le projet <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function FeaturedProjects({
  projects,
}: {
  projects: ProjectWithStacks[];
}) {
  if (projects.length === 0) return null;

  return (
    <SectionLayout variant="default" glow aria-label="Projets en vedette">
      <SectionTitle subtitle="projets" title="Projets en vedette" />
      <div className="mt-12 flex flex-col gap-14">
        {projects.map((project) => (
          <HighlightCard key={project.id} project={project} />
        ))}
      </div>
      <p className="text-muted-foreground mt-12 flex items-center gap-2">
        Envie d'en voir plus ?
        <Link
          href="/portfolio"
          className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
        >
          Voir tous les projets <ArrowRight className="size-4" />
        </Link>
      </p>
    </SectionLayout>
  );
}
