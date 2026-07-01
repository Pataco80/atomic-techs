"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { toJsonInput } from "@/lib/prisma-json";
import {
  CreateContentPageSchema,
  DeleteContentPageSchema,
  UpdateContentPageSchema,
} from "./content-page.schema";

/**
 * `ContentPage.slug` is globally unique at the DB level (even for soft-deleted
 * rows), so we check across every row to surface a friendly error instead of a
 * raw unique-constraint violation.
 */
const assertSlugAvailable = async (slug: string, excludeId?: string) => {
  const existing = await prisma.contentPage.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
  if (existing) {
    throw new ActionError("Ce slug est déjà utilisé");
  }
};

export const createContentPageAction = authAction
  .inputSchema(CreateContentPageSchema)
  .action(async ({ parsedInput }) => {
    const { body, ...rest } = parsedInput;
    await assertSlugAvailable(rest.slug);
    const page = await prisma.contentPage.create({
      data: { ...rest, body: toJsonInput(body) },
    });

    return { id: page.id };
  });

export const updateContentPageAction = authAction
  .inputSchema(UpdateContentPageSchema)
  .action(async ({ parsedInput }) => {
    const { id, body, ...rest } = parsedInput;
    await assertSlugAvailable(rest.slug, id);
    await prisma.contentPage.update({
      where: { id },
      data: { ...rest, body: toJsonInput(body) },
    });

    return { id };
  });

export const deleteContentPageAction = authAction
  .inputSchema(DeleteContentPageSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.contentPage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { id };
  });
