import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const projectInclude = {
  stacks: {
    include: { stackItem: true },
  },
} satisfies Prisma.ProjectInclude;

/** All non-deleted projects, in display order, with their linked stack items. */
export const getProjects = async () => {
  return prisma.project.findMany({
    where: { deletedAt: null },
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

type ProjectList = Prisma.PromiseReturnType<typeof getProjects>;

export type ProjectWithStacks = ProjectList[number];
