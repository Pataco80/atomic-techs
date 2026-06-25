import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ContentPageSchema = z.object({
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(slugRegex, "Slug invalide (minuscules, chiffres et tirets)"),
  title: z.string().min(1, "Le titre est requis"),
  body: z.custom<JSONContent>().nullish(),
});

export const CreateContentPageSchema = ContentPageSchema;

export const UpdateContentPageSchema = ContentPageSchema.extend({
  id: z.string().min(1),
});

export const DeleteContentPageSchema = z.object({
  id: z.string().min(1),
});

export type ContentPageValues = z.infer<typeof ContentPageSchema>;
