"use server";

// PIÈGE #1: the portfolio contact form is posted by an ANONYMOUS visitor — this
// MUST use the public `action` client, NEVER `authAction` (which would require a
// session and block every submission).
import { action } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { ContactFormSchema } from "./contact-portfolio.schema";

export const submitContactAction = action
  .inputSchema(ContactFormSchema)
  .action(async ({ parsedInput }) => {
    const { website, name, email, subject, message } = parsedInput;

    // Honeypot tripped → pretend success (give bots no signal), write nothing.
    if (website && website.trim() !== "") {
      return { ok: true };
    }

    await prisma.contact.create({
      data: { name, email, subject, message },
    });

    return { ok: true };
  });
