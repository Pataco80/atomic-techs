import { Typography } from "@/components/nowts/typography";
import { SectionTitle } from "@/components/shared/section-title";
import { SectionLayout } from "@/features/landing/section-layout";
import { ProjectsGrid } from "@/features/projects/projects-grid";
import { getProjects } from "@/query/portfolio/get-projects";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";

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
    <SectionLayout variant="default" glow>
      <SectionTitle as="h1" subtitle="projets" title="Portfolio" />
      <Typography variant="muted" className="mt-3">
        Tous les projets réalisés.
      </Typography>
      <div className="mt-12">
        <ProjectsGrid projects={projects} page={Number(page) || 1} />
      </div>
    </SectionLayout>
  );
}
