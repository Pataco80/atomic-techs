import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getProjects } from "@/query/portfolio/get-projects";
import { getStacks } from "@/query/portfolio/get-stacks";
import { Suspense } from "react";
import { ProjectsList } from "./_components/projects-list";

export default function ProjectsPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Projets</LayoutTitle>
        <LayoutDescription>
          Gérez les projets affichés dans le portfolio.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsSection />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}

async function ProjectsSection() {
  const [projects, stackItems] = await Promise.all([
    getProjects(),
    getStacks(),
  ]);

  return <ProjectsList projects={projects} stackItems={stackItems} />;
}

function ProjectsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {["a", "b", "c", "d"].map((key) => (
        <Skeleton key={key} className="h-16 w-full" />
      ))}
    </div>
  );
}
