"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { emptyToNull } from "@/lib/format/empty-to-null";
import { prisma } from "@/lib/prisma";
import { toJsonInput } from "@/lib/prisma-json";
import {
  CreateCareerEventSchema,
  DeleteCareerEventSchema,
  UpdateCareerEventSchema,
} from "./career.schema";

export const createCareerEventAction = authAction
  .inputSchema(CreateCareerEventSchema)
  .action(async ({ parsedInput }) => {
    const {
      description,
      companyLogo,
      endMonth,
      endYear,
      stackItemIds,
      ...rest
    } = parsedInput;
    const event = await prisma.careerEvent.create({
      data: {
        ...rest,
        companyLogo: emptyToNull(companyLogo),
        endMonth: endMonth ?? null,
        endYear: endYear ?? null,
        description: toJsonInput(description),
        stacks: {
          create: stackItemIds.map((stackItemId) => ({ stackItemId })),
        },
      },
    });

    return { id: event.id };
  });

export const updateCareerEventAction = authAction
  .inputSchema(UpdateCareerEventSchema)
  .action(async ({ parsedInput }) => {
    const {
      id,
      description,
      companyLogo,
      endMonth,
      endYear,
      stackItemIds,
      ...rest
    } = parsedInput;
    await prisma.$transaction([
      prisma.careerEventStack.deleteMany({ where: { careerEventId: id } }),
      prisma.careerEvent.update({
        where: { id },
        data: {
          ...rest,
          companyLogo: emptyToNull(companyLogo),
          endMonth: endMonth ?? null,
          endYear: endYear ?? null,
          description: toJsonInput(description),
          stacks: {
            create: stackItemIds.map((stackItemId) => ({ stackItemId })),
          },
        },
      }),
    ]);

    return { id };
  });

export const deleteCareerEventAction = authAction
  .inputSchema(DeleteCareerEventSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.careerEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { id };
  });
