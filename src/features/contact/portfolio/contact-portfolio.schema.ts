import { z } from "zod";

/** Subject options — kept in sync with the Prisma `ContactSubject` enum. */
export const CONTACT_SUBJECTS = [
  "QUESTIONS_SERVICES",
  "DEVIS",
  "AUTRE",
] as const;

export const ContactFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().min(1, "Le message est requis"),
  // Honeypot: hidden field that humans never fill; bots do. Optional.
  website: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
