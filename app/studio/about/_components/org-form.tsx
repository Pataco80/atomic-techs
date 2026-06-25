"use client";

import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { OrgProfileRecord } from "@/query/portfolio/get-about";
import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertOrgAction } from "../_actions/org.action";
import {
  OrgProfileSchema,
  type OrgProfileValues,
} from "../_actions/org.schema";

type OrgFormProps = {
  org: OrgProfileRecord | null;
};

function readSocial(socials: unknown, key: string): string {
  if (
    socials == null ||
    typeof socials !== "object" ||
    Array.isArray(socials)
  ) {
    return "";
  }
  const value = (socials as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export function OrgForm({ org }: OrgFormProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: OrgProfileValues) =>
      resolveActionResult(upsertOrgAction(values)),
    onSuccess: () => {
      toast.success("Organisation enregistrée");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: OrgProfileSchema,
    defaultValues: {
      logo: org?.logo ?? null,
      name: org?.name ?? "",
      email: org?.email ?? "",
      phone: org?.phone ?? "",
      website: org?.website ?? "",
      address: org?.address ?? "",
      socials: {
        github: readSocial(org?.socials, "github"),
        linkedin: readSocial(org?.socials, "linkedin"),
        twitter: readSocial(org?.socials, "twitter"),
        instagram: readSocial(org?.socials, "instagram"),
      },
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4">
      <form.AppField name="name">
        {(field) => (
          <field.Field>
            <field.Label>Nom de l'organisation</field.Label>
            <field.Content>
              <field.Input placeholder="Atomic Techs" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="logo">
        {(field) => (
          <field.Field>
            <field.Label>Logo</field.Label>
            <field.Content>
              <ImageUploadField
                value={field.state.value}
                onChange={(url) => field.handleChange(url)}
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="email">
          {(field) => (
            <field.Field>
              <field.Label>Email</field.Label>
              <field.Content>
                <field.Input type="email" placeholder="contact@exemple.com" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="phone">
          {(field) => (
            <field.Field>
              <field.Label>Téléphone</field.Label>
              <field.Content>
                <field.Input placeholder="+33 1 23 45 67 89" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </div>

      <form.AppField name="website">
        {(field) => (
          <field.Field>
            <field.Label>Site web</field.Label>
            <field.Content>
              <field.Input placeholder="https://exemple.com" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="address">
        {(field) => (
          <field.Field>
            <field.Label>Adresse</field.Label>
            <field.Content>
              <field.Textarea rows={2} placeholder="10 rue de la Paix, Paris" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="socials.github">
          {(field) => (
            <field.Field>
              <field.Label>GitHub</field.Label>
              <field.Content>
                <field.Input placeholder="https://github.com/..." />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="socials.linkedin">
          {(field) => (
            <field.Field>
              <field.Label>LinkedIn</field.Label>
              <field.Content>
                <field.Input placeholder="https://linkedin.com/in/..." />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="socials.twitter">
          {(field) => (
            <field.Field>
              <field.Label>Twitter / X</field.Label>
              <field.Content>
                <field.Input placeholder="https://x.com/..." />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="socials.instagram">
          {(field) => (
            <field.Field>
              <field.Label>Instagram</field.Label>
              <field.Content>
                <field.Input placeholder="https://instagram.com/..." />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </div>

      <div className="flex justify-end">
        <form.SubmitButton>Enregistrer</form.SubmitButton>
      </div>
    </Form>
  );
}
