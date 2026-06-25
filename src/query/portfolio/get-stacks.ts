import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/** All non-deleted stack items, in display order. */
export const getStacks = async () => {
  return prisma.stackItem.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });
};

type StackList = Prisma.PromiseReturnType<typeof getStacks>;

export type StackItemRecord = StackList[number];
