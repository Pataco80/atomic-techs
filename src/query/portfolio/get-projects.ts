import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const projectInclude = {
  stacks: {
    include: { stackItem: true },
  },
  gallery: {
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  },
} satisfies Prisma.ProjectInclude;

/**
 * All non-deleted projects for the public catalogue (/portfolio), featured
 * first, then by manual order, then newest — with their linked stack items.
 */
export const getProjects = async () => {
  return prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    include: projectInclude,
  });
};

/**
 * Featured projects only, in display order — the home "FeaturedProjects"
 * section renders these.
 */
export const getFeaturedProjects = async () => {
  return prisma.project.findMany({
    where: { featured: true, deletedAt: null },
    orderBy: { order: "asc" },
    include: projectInclude,
  });
};

export const getProjectById = async (id: string) => {
  return prisma.project.findFirst({
    where: { id, deletedAt: null },
    include: projectInclude,
  });
};

/** A single non-deleted project by its public slug, or null. */
export const getProjectBySlug = async (slug: string) => {
  return prisma.project.findFirst({
    where: { slug, deletedAt: null },
    include: projectInclude,
  });
};

type ProjectList = Prisma.PromiseReturnType<typeof getProjects>;

export type ProjectWithStacks = ProjectList[number];
