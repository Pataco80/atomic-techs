import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/** Singleton person profile (the portfolio owner), or null if never set. */
export const getPersonProfile = async () => {
  return prisma.personProfile.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
  });
};

/** Singleton organisation profile, or null if never set. */
export const getOrgProfile = async () => {
  return prisma.orgProfile.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
  });
};

/**
 * All non-deleted career events. Base DB ordering is most-recent start first;
 * the precise "current job first" ordering is applied in the app layer via
 * `sortCareerEventsChrono`.
 */
export const getCareerEvents = async () => {
  return prisma.careerEvent.findMany({
    where: { deletedAt: null },
    orderBy: [{ startYear: "desc" }, { startMonth: "desc" }],
  });
};

/** All non-deleted content pages, oldest first. */
export const getContentPages = async () => {
  return prisma.contentPage.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
  });
};

/** A single non-deleted content page by slug (e.g. "legal", "changelog"), or null. */
export const getContentPageBySlug = async (slug: string) => {
  return prisma.contentPage.findFirst({
    where: { slug, deletedAt: null },
  });
};

export type PersonProfileRecord = NonNullable<
  Prisma.PromiseReturnType<typeof getPersonProfile>
>;
export type OrgProfileRecord = NonNullable<
  Prisma.PromiseReturnType<typeof getOrgProfile>
>;
export type CareerEventRecord = Prisma.PromiseReturnType<
  typeof getCareerEvents
>[number];
export type ContentPageRecord = Prisma.PromiseReturnType<
  typeof getContentPages
>[number];
