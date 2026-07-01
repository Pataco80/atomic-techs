import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/** All non-deleted contact submissions, newest first (read in the Studio dashboard). */
export const getContacts = async () => {
  return prisma.contact.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

type ContactList = Prisma.PromiseReturnType<typeof getContacts>;

export type ContactRecord = ContactList[number];
