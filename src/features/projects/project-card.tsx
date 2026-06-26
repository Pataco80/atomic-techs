import { TechBadge } from "@/features/knowtecks/tech-badge";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import Image from "next/image";
import Link from "next/link";
import { projectPlaceholder } from "./project-placeholder";

export function ProjectCard({ project }: { project: ProjectWithStacks }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group focus-visible:ring-ring block rounded-lg focus-visible:ring-2 focus-visible:outline-none"
      aria-label={project.title}
    >
      <article className="bg-muted/40 hover:border-primary/60 border-foreground/10 flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          <Image
            src={project.imageUrl ?? projectPlaceholder(project.id)}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="group-hover:text-primary text-lg font-medium transition-colors">
            {project.title}
          </h3>
          {project.longDescription ? (
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {project.longDescription}
            </p>
          ) : null}
          {project.stacks.length > 0 ? (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {project.stacks.map((s) => (
                <TechBadge key={s.stackItem.id} name={s.stackItem.name} />
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
