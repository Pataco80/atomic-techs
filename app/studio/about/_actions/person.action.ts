"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { emptyToNull } from "@/lib/format/empty-to-null";
import { prisma } from "@/lib/prisma";
import { toJsonInput } from "@/lib/prisma-json";
import { PersonProfileSchema } from "./person.schema";

export const upsertPersonAction = authAction
  .inputSchema(PersonProfileSchema)
  .action(async ({ parsedInput }) => {
    const { bioHome, bioWork, ...rest } = parsedInput;
    const data = {
      fullName: emptyToNull(rest.fullName),
      headline: emptyToNull(rest.headline),
      email: emptyToNull(rest.email),
      phone: emptyToNull(rest.phone),
      location: emptyToNull(rest.location),
      avatarUrl: emptyToNull(rest.avatarUrl),
      bioHome: toJsonInput(bioHome),
      bioWork: toJsonInput(bioWork),
    };

    const existing = await prisma.personProfile.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: "asc" },
    });

    const profile = existing
      ? await prisma.personProfile.update({ where: { id: existing.id }, data })
      : await prisma.personProfile.create({ data });

    return { id: profile.id };
  });
