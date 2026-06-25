import type { JSONContent } from "@tiptap/react";
import { z } from "zod";

const optionalEmail = z
  .string()
  .email("Email invalide")
  .or(z.literal(""))
  .nullish();
const optionalUrl = z.string().url("URL invalide").or(z.literal("")).nullish();

export const PersonProfileSchema = z.object({
  fullName: z.string().nullish(),
  headline: z.string().nullish(),
  email: optionalEmail,
  phone: z.string().nullish(),
  location: z.string().nullish(),
  avatarUrl: optionalUrl,
  bioHome: z.custom<JSONContent>().nullish(),
  bioWork: z.custom<JSONContent>().nullish(),
});

export type PersonProfileValues = z.infer<typeof PersonProfileSchema>;
