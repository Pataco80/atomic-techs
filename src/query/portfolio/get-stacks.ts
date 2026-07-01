import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/** All non-deleted stack items, in display order (back-office). */
export const getStacks = async () => {
  return prisma.stackItem.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });
};

/**
 * Featured stack items only, in display order — the public "compétences"
 * section renders these (non-featured stacks stay a back-office reserve).
 */
export const getFeaturedStacks = async () => {
  return prisma.stackItem.findMany({
    where: { featured: true, deletedAt: null },
    orderBy: { order: "asc" },
  });
};

type StackList = Prisma.PromiseReturnType<typeof getStacks>;

export type StackItemRecord = StackList[number];
