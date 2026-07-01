"use client";

import { GroupedList } from "@/components/ios";
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

const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";
const iosRow = "relative gap-1.5 px-4 py-3";

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
    <Form form={form} className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <GroupedList header="Organisation">
        <form.AppField name="name">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">
                Nom de l'organisation
              </field.Label>
              <field.Content>
                <field.Input className={iosInput} placeholder="Atomic Techs" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </GroupedList>

      <GroupedList header="Logo">
        <form.AppField name="logo">
          {(field) => (
            <field.Field className="relative gap-2 px-4 py-3">
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
      </GroupedList>

      <GroupedList header="Contact">
        <form.AppField name="email">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Email</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  type="email"
                  placeholder="contact@exemple.com"
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="phone">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Téléphone</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="+33 1 23 45 67 89"
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="website">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Site web</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="https://exemple.com"
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="address">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Adresse</field.Label>
              <field.Content>
                <field.Textarea
                  rows={2}
                  className={iosInput}
                  placeholder="10 rue de la Paix, Paris"
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </GroupedList>

      <GroupedList header="Réseaux sociaux">
        <form.AppField name="socials.github">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">GitHub</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="https://github.com/..."
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="socials.linkedin">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">LinkedIn</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="https://linkedin.com/in/..."
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="socials.twitter">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Twitter / X</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="https://x.com/..."
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="socials.instagram">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Instagram</field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="https://instagram.com/..."
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </GroupedList>

      <div className="flex justify-end">
        <form.SubmitButton variant="default">Enregistrer</form.SubmitButton>
      </div>
    </Form>
  );
}
