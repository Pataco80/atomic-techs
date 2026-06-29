import { Typography } from "@/components/nowts/typography";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="bg-muted/40 hover:bg-pale-sky-300/40 dark:hover:bg-muted/60 border-foreground/10 hover:border-accent/70 flex h-full flex-col gap-0 overflow-hidden rounded-lg py-0 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-lg transition-all">
        <div className="bg-muted relative aspect-video w-full overflow-hidden">
          <Image
            src={project.imageUrl ?? projectPlaceholder(project.id)}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          <Typography
            variant="large"
            as="h3"
            className="group-hover:text-accent font-medium transition-colors"
          >
            {project.title}
          </Typography>
          {project.longDescription ? (
            <Typography variant="muted" className="line-clamp-3">
              {project.longDescription}
            </Typography>
          ) : null}
          {project.stacks.length > 0 ? (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {project.stacks.map((s) => (
                <TechBadge key={s.stackItem.id} name={s.stackItem.name} />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
