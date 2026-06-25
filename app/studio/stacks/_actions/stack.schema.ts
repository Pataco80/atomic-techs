import { z } from "zod";

/** Shared shape between the create and update stack forms. */
export const StackFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  iconSvg: z.string().min(1, "Le code SVG est requis"),
  validatedAt: z
    .string()
    .min(1, "La date est requise")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Date invalide"),
  order: z.number().int().min(0).default(0),
});

export const CreateStackSchema = StackFormSchema;

export const UpdateStackSchema = StackFormSchema.extend({
  id: z.string().min(1),
});

export const DeleteStackSchema = z.object({
  id: z.string().min(1),
});

export const ReorderStacksSchema = z.object({
  ids: z.array(z.string().min(1)),
});

export type StackFormValues = z.infer<typeof StackFormSchema>;
