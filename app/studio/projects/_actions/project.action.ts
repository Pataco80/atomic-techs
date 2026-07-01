"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { fileAdapter } from "@/lib/files/vercel-blob-adapter";
import { prisma } from "@/lib/prisma";
import { removedImageUrls, withOrder } from "./gallery-sync";
import {
  CreateProjectSchema,
  DeleteProjectSchema,
  ReorderProjectsSchema,
  ToggleProjectFeaturedSchema,
  UpdateProjectSchema,
} from "./project.schema";

/** Rejects if another (non-deleted or deleted) project already owns the slug. */
async function assertSlugAvailable(slug: string, excludeId?: string) {
  const clash = await prisma.project.findFirst({
    where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  if (clash) throw new ActionError("Ce slug est déjà utilisé");
}

export const createProjectAction = authAction
  .inputSchema(CreateProjectSchema)
  .action(async ({ parsedInput }) => {
    const {
      stackItemIds,
      galleryItems,
      liveUrl,
      githubUrl,
      imageUrl,
      ...rest
    } = parsedInput;
    await assertSlugAvailable(rest.slug);

    const project = await prisma.project.create({
      data: {
        ...rest,
        imageUrl: imageUrl ?? null,
        liveUrl: liveUrl ?? null,
        githubUrl: githubUrl ?? null,
        stacks: {
          create: stackItemIds.map((stackItemId) => ({ stackItemId })),
        },
        gallery: {
          create: withOrder(galleryItems),
        },
      },
    });

    return { id: project.id };
  });

export const updateProjectAction = authAction
  .inputSchema(UpdateProjectSchema)
  .action(async ({ parsedInput }) => {
    const {
      id,
      stackItemIds,
      galleryItems,
      liveUrl,
      githubUrl,
      imageUrl,
      ...rest
    } = parsedInput;
    await assertSlugAvailable(rest.slug, id);

    const previousGallery = await prisma.projectGalleryItem.findMany({
      where: { projectId: id },
      select: { imageUrl: true },
    });

    await prisma.$transaction([
      prisma.projectStack.deleteMany({ where: { projectId: id } }),
      prisma.projectGalleryItem.deleteMany({ where: { projectId: id } }),
      prisma.project.update({
        where: { id },
        data: {
          ...rest,
          imageUrl: imageUrl ?? null,
          liveUrl: liveUrl ?? null,
          githubUrl: githubUrl ?? null,
          stacks: {
            create: stackItemIds.map((stackItemId) => ({ stackItemId })),
          },
          gallery: {
            create: withOrder(galleryItems),
          },
        },
      }),
    ]);

    // Best-effort: drop the blobs of gallery images that were removed.
    await fileAdapter.deleteFiles(
      removedImageUrls(
        previousGallery.map((item) => item.imageUrl),
        galleryItems.map((item) => item.imageUrl),
      ),
    );

    return { id };
  });

export const deleteProjectAction = authAction
  .inputSchema(DeleteProjectSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { id };
  });

export const toggleProjectFeaturedAction = authAction
  .inputSchema(ToggleProjectFeaturedSchema)
  .action(async ({ parsedInput: { id, featured } }) => {
    await prisma.project.update({
      where: { id },
      data: { featured },
    });

    return { id, featured };
  });

export const reorderProjectsAction = authAction
  .inputSchema(ReorderProjectsSchema)
  .action(async ({ parsedInput: { ids } }) => {
    // Sequential updates inside one transaction: concurrent writes on an
    // interactive-transaction connection are discouraged by Prisma.
    await prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        // eslint-disable-next-line no-await-in-loop
        await tx.project.update({ where: { id }, data: { order: index } });
      }
    });

    return { count: ids.length };
  });
