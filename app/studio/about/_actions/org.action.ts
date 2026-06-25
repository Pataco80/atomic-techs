"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { emptyToNull } from "@/lib/format/empty-to-null";
import { prisma } from "@/lib/prisma";
import { toJsonInput } from "@/lib/prisma-json";
import { OrgProfileSchema } from "./org.schema";

export const upsertOrgAction = authAction
  .inputSchema(OrgProfileSchema)
  .action(async ({ parsedInput }) => {
    const { socials, ...rest } = parsedInput;
    const cleanedSocials = {
      github: emptyToNull(socials.github),
      linkedin: emptyToNull(socials.linkedin),
      twitter: emptyToNull(socials.twitter),
      instagram: emptyToNull(socials.instagram),
    };
    const data = {
      logo: emptyToNull(rest.logo),
      name: emptyToNull(rest.name),
      email: emptyToNull(rest.email),
      phone: emptyToNull(rest.phone),
      website: emptyToNull(rest.website),
      address: emptyToNull(rest.address),
      socials: toJsonInput(cleanedSocials),
    };

    const existing = await prisma.orgProfile.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: "asc" },
    });

    const profile = existing
      ? await prisma.orgProfile.update({ where: { id: existing.id }, data })
      : await prisma.orgProfile.create({ data });

    return { id: profile.id };
  });
