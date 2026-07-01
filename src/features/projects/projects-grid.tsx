import { AutomaticPagination } from "@/components/nowts/automatic-pagination";
import { Typography } from "@/components/nowts/typography";
import { paginate } from "@/lib/format/paginate";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import { ProjectCard } from "./project-card";

const PER_PAGE = 12;

export function ProjectsGrid({
  projects,
  page,
}: {
  projects: ProjectWithStacks[];
  page: number;
}) {
  const {
    items,
    page: current,
    totalPages,
    total,
  } = paginate(projects, page, PER_PAGE);

  if (total === 0) {
    return (
      <Typography variant="muted">
        Aucun projet pour le moment. Revenez bientôt !
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <AutomaticPagination currentPage={current} totalPages={totalPages} />
    </div>
  );
}
