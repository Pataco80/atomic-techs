"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import {
  CreateStackSchema,
  DeleteStackSchema,
  ReorderStacksSchema,
  UpdateStackSchema,
} from "./stack.schema";

export const createStackAction = authAction
  .inputSchema(CreateStackSchema)
  .action(async ({ parsedInput }) => {
    const { validatedAt, ...rest } = parsedInput;
    const stack = await prisma.stackItem.create({
      data: { ...rest, validatedAt: new Date(validatedAt) },
    });

    return { id: stack.id };
  });

export const updateStackAction = authAction
  .inputSchema(UpdateStackSchema)
  .action(async ({ parsedInput }) => {
    const { id, validatedAt, ...rest } = parsedInput;
    await prisma.stackItem.update({
      where: { id },
      data: { ...rest, validatedAt: new Date(validatedAt) },
    });

    return { id };
  });

export const deleteStackAction = authAction
  .inputSchema(DeleteStackSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.stackItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { id };
  });

export const reorderStacksAction = authAction
  .inputSchema(ReorderStacksSchema)
  .action(async ({ parsedInput: { ids } }) => {
    // Sequential updates inside one transaction: concurrent writes on an
    // interactive-transaction connection are discouraged by Prisma.
    await prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        // eslint-disable-next-line no-await-in-loop
        await tx.stackItem.update({ where: { id }, data: { order: index } });
      }
    });

    return { count: ids.length };
  });
