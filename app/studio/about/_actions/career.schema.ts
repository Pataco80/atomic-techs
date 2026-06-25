import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

export const CareerEventSchema = z
  .object({
    jobTitle: z.string().min(1, "Le poste est requis"),
    companyName: z.string().min(1, "L'entreprise est requise"),
    companyLogo: z.string().url("URL invalide").or(z.literal("")).nullish(),
    startMonth: z.number().int().min(1).max(12),
    startYear: z.number().int().min(1900).max(2100),
    endMonth: z.number().int().min(1).max(12).nullish(),
    endYear: z.number().int().min(1900).max(2100).nullish(),
    description: z.custom<JSONContent>().nullish(),
  })
  .refine((data) => data.endYear == null || data.endMonth != null, {
    message: "Le mois de fin est requis",
    path: ["endMonth"],
  })
  .refine(
    (data) => {
      if (data.endYear == null) return true;
      const start = data.startYear * 12 + data.startMonth;
      const end = data.endYear * 12 + (data.endMonth ?? 1);
      return end >= start;
    },
    { message: "La fin doit suivre le début", path: ["endYear"] },
  );

export const CreateCareerEventSchema = CareerEventSchema;

export const UpdateCareerEventSchema = z.intersection(
  CareerEventSchema,
  z.object({ id: z.string().min(1) }),
);

export const DeleteCareerEventSchema = z.object({
  id: z.string().min(1),
});

export type CareerEventValues = z.infer<typeof CareerEventSchema>;
