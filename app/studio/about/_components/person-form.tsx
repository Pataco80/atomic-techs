"use client";

import { RichTextEditor } from "@/components/nowts/rich-text-editor";
import { GroupedList } from "@/components/ios";
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

const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";
const iosRow = "relative gap-1.5 px-4 py-3";

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
    <Form form={form} className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <GroupedList header="Identité">
        <form.AppField name="fullName">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Nom complet</field.Label>
              <field.Content>
                <field.Input className={iosInput} placeholder="Jean Dupont" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="headline">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">
                Titre / accroche
              </field.Label>
              <field.Content>
                <field.Input
                  className={iosInput}
                  placeholder="Développeur Full-Stack"
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
                  placeholder="jean@exemple.com"
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
                  placeholder="+33 6 12 34 56 78"
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="location">
          {(field) => (
            <field.Field className={iosRow}>
              <field.Label className="text-ios-label">Localisation</field.Label>
              <field.Content>
                <field.Input className={iosInput} placeholder="Paris, France" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </GroupedList>

      <GroupedList header="Médias">
        <form.AppField name="avatarUrl">
          {(field) => (
            <field.Field className="relative gap-2 px-4 py-3">
              <field.Label className="text-ios-label">Avatar</field.Label>
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

      <GroupedList header="Bio (page d'accueil)">
        <form.AppField name="bioHome">
          {(field) => (
            <field.Field className="relative gap-2 px-4 py-3">
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
      </GroupedList>

      <GroupedList header="Bio (parcours)">
        <form.AppField name="bioWork">
          {(field) => (
            <field.Field className="relative gap-2 px-4 py-3">
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
      </GroupedList>

      <div className="flex justify-end">
        <form.SubmitButton variant="default">Enregistrer</form.SubmitButton>
      </div>
    </Form>
  );
}
