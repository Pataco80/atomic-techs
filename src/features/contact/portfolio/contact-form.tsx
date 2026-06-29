"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitContactAction } from "./contact-portfolio.action";
import {
  ContactFormSchema,
  type ContactFormValues,
} from "./contact-portfolio.schema";

const SUBJECT_LABELS: Record<ContactFormValues["subject"], string> = {
  QUESTIONS_SERVICES: "Questions / services",
  DEVIS: "Demande de devis",
  AUTRE: "Autre",
};

// Champs au look Hygraph : fond FIXE pale-sky-800 (#383c43 = rgb(56,60,67),
// identique light/dark), texte clair, ring bleu (blue-ribbon-400) au focus,
// ring rouge (destructive) en erreur (déclenché par aria-invalid du wrapper).
const FIELD_CLASS =
  "h-11 rounded-lg border-transparent bg-pale-sky-800! px-4 text-pale-sky-50 placeholder:text-pale-sky-300 shadow-none focus-visible:ring-2 focus-visible:ring-blue-ribbon-400 aria-invalid:ring-2 aria-invalid:ring-destructive";
const TEXTAREA_CLASS =
  "min-h-40 resize-none rounded-lg border-transparent bg-pale-sky-800! px-4 py-3 text-pale-sky-50 placeholder:text-pale-sky-300 shadow-none focus-visible:ring-2 focus-visible:ring-blue-ribbon-400 aria-invalid:ring-2 aria-invalid:ring-destructive";

export function ContactForm({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) {
  const mutation = useMutation({
    mutationFn: async (values: ContactFormValues) =>
      resolveActionResult(submitContactAction(values)),
    onSuccess: () => {
      toast.success("Votre message a bien été envoyé. Merci !");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: ContactFormSchema,
    defaultValues: {
      name: "",
      email: "",
      subject: "QUESTIONS_SERVICES",
      message: "",
      website: "",
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col items-center gap-6">
      {/* Honeypot: hidden from humans (display:none + off tab order). */}
      <form.AppField name="website">
        {(field) => (
          <div className="hidden" aria-hidden="true">
            <label htmlFor={field.name}>Ne pas remplir</label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.AppField>

      <form.AppField name="name">
        {(field) => (
          <field.Field>
            <field.Label>Nom</field.Label>
            <field.Content>
              <field.Input placeholder="Nom" className={FIELD_CLASS} />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="email">
        {(field) => (
          <field.Field>
            <field.Label>Email</field.Label>
            <field.Content>
              <field.Input
                type="email"
                placeholder="Email"
                className={FIELD_CLASS}
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="subject">
        {(field) => (
          <field.Field>
            <field.Label>Sujet</field.Label>
            <field.Content>
              <field.Select>
                <SelectTrigger className={`${FIELD_CLASS} w-full`}>
                  <SelectValue placeholder="Choisissez un sujet" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.Select>
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="message">
        {(field) => (
          <field.Field>
            <field.Label>Message</field.Label>
            <field.Content>
              <field.Textarea
                rows={5}
                placeholder="Message"
                className={TEXTAREA_CLASS}
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton size="lg" className="w-56">
        Envoyer
      </form.SubmitButton>
    </Form>
  );
}
