import { z } from "zod";

const optionalEmail = z
  .string()
  .email("Email invalide")
  .or(z.literal(""))
  .nullish();
const optionalUrl = z.string().url("URL invalide").or(z.literal("")).nullish();

export const OrgProfileSchema = z.object({
  logo: optionalUrl,
  name: z.string().nullish(),
  email: optionalEmail,
  phone: z.string().nullish(),
  website: optionalUrl,
  address: z.string().nullish(),
  socials: z
    .object({
      github: z.string().nullish(),
      linkedin: z.string().nullish(),
      twitter: z.string().nullish(),
      instagram: z.string().nullish(),
    })
    .default({}),
});

export type OrgProfileValues = z.infer<typeof OrgProfileSchema>;
