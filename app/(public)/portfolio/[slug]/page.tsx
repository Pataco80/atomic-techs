import { ProjectDetails } from "@/features/projects-details/project-details";
import { getProjectBySlug } from "@/query/portfolio/get-projects";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const description = project.longDescription.slice(0, 160);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `${SiteConfig.prodUrl}/portfolio/${project.slug}`,
      ...(project.imageUrl ? { images: [project.imageUrl] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProjectDetails slug={slug} />;
}
