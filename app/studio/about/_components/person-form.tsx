"use client";

import { RichTextEditor } from "@/components/nowts/rich-text-editor";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { PersonProfileRecord } from "@/query/portfolio/get-about";
import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import type { JSONContent } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertPersonAction } from "../_actions/person.action";
import {
  PersonProfileSchema,
  type PersonProfileValues,
} from "../_actions/person.schema";

type PersonFormProps = {
  person: PersonProfileRecord | null;
};

export function PersonForm({ person }: PersonFormProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: PersonProfileValues) =>
      resolveActionResult(upsertPersonAction(values)),
    onSuccess: () => {
      toast.success("Profil enregistré");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: PersonProfileSchema,
    defaultValues: {
      fullName: person?.fullName ?? "",
      headline: person?.headline ?? "",
      email: person?.email ?? "",
      phone: person?.phone ?? "",
      location: person?.location ?? "",
      avatarUrl: person?.avatarUrl ?? null,
      bioHome: (person?.bioHome ?? null) as JSONContent | null,
      bioWork: (person?.bioWork ?? null) as JSONContent | null,
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4">
      <form.AppField name="fullName">
        {(field) => (
          <field.Field>
            <field.Label>Nom complet</field.Label>
            <field.Content>
              <field.Input placeholder="Jean Dupont" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="headline">
        {(field) => (
          <field.Field>
            <field.Label>Titre / accroche</field.Label>
            <field.Content>
              <field.Input placeholder="Développeur Full-Stack" />
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
                <field.Input type="email" placeholder="jean@exemple.com" />
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
                <field.Input placeholder="+33 6 12 34 56 78" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </div>

      <form.AppField name="location">
        {(field) => (
          <field.Field>
            <field.Label>Localisation</field.Label>
            <field.Content>
              <field.Input placeholder="Paris, France" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="avatarUrl">
        {(field) => (
          <field.Field>
            <field.Label>Avatar</field.Label>
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

      <form.AppField name="bioHome">
        {(field) => (
          <field.Field>
            <field.Label>Bio (page d'accueil)</field.Label>
            <field.Content>
              <RichTextEditor
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="bioWork">
        {(field) => (
          <field.Field>
            <field.Label>Bio (parcours)</field.Label>
            <field.Content>
              <RichTextEditor
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <div className="flex justify-end">
        <form.SubmitButton>Enregistrer</form.SubmitButton>
      </div>
    </Form>
  );
}
