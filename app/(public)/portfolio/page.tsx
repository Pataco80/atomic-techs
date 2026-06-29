import { PageIntro } from "@/components/shared/page-intro";
import { SectionLayout } from "@/features/landing/section-layout";
import { ProjectsGrid } from "@/features/projects/projects-grid";
import { getProjects } from "@/query/portfolio/get-projects";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { CircuitDivider } from "@/components/shared/circuit-divider";
export const metadata: Metadata = {
  title: "Portfolio",
  description: `Projets réalisés — ${SiteConfig.title}.`,
  alternates: { canonical: "/portfolio" },
};

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function PortfolioPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const projects = await getProjects();

  return (
    <>
      <PageIntro
        subtitle="projets"
        title="Mes Projets"
        description="Ici vous pouvez voir une partie du travail que j'ai développé. Naviguez librement et explorez les projets pour voir comment ils ont été créés, les technologies utilisées et les fonctionnalités mises en œuvre."
        backHref="/"
      />
      <CircuitDivider variant="hero" className="bg-hero-portfolio" />
      <SectionLayout variant="default" glow>
        <ProjectsGrid projects={projects} page={Number(page) || 1} />
      </SectionLayout>
    </>
  );
}
