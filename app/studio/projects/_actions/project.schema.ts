import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** URL field that tolerates empty string / null from the form. */
const optionalUrl = z.string().url("URL invalide").or(z.literal("")).nullish();

/** Shared shape between the create and update forms. */
export const ProjectFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(slugRegex, "Slug invalide (minuscules, chiffres et tirets)"),
  longDescription: z.string().min(1, "La description est requise"),
  imageUrl: z.string().url("URL invalide").nullish(),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  stackItemIds: z.array(z.string()).default([]),
});

export const CreateProjectSchema = ProjectFormSchema;

export const UpdateProjectSchema = ProjectFormSchema.extend({
  id: z.string().min(1),
});

export const DeleteProjectSchema = z.object({
  id: z.string().min(1),
});

export const ToggleProjectFeaturedSchema = z.object({
  id: z.string().min(1),
  featured: z.boolean(),
});

export const ReorderProjectsSchema = z.object({
  ids: z.array(z.string().min(1)),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;
