"use client";

import { RichTextEditor } from "@/components/nowts/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { slugify } from "@/lib/format/slugify";
import type { ContentPageRecord } from "@/query/portfolio/get-about";
import type { JSONContent } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  createContentPageAction,
  updateContentPageAction,
} from "../_actions/content-page.action";
import {
  ContentPageSchema,
  type ContentPageValues,
} from "../_actions/content-page.schema";

type ContentPageFormProps = {
  page?: ContentPageRecord;
  onSuccess: () => void;
};

export function ContentPageForm({ page, onSuccess }: ContentPageFormProps) {
  const isEdit = Boolean(page);
  const [slugEdited, setSlugEdited] = useState(isEdit);

  const mutation = useMutation({
    mutationFn: async (values: ContentPageValues) =>
      resolveActionResult(
        page
          ? updateContentPageAction({ ...values, id: page.id })
          : createContentPageAction(values),
      ),
    onSuccess: () => {
      toast.success(isEdit ? "Page mise à jour" : "Page créée");
      onSuccess();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: ContentPageSchema,
    defaultValues: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      body: (page?.body ?? null) as JSONContent | null,
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4">
      <form.AppField name="title">
        {(field) => (
          <field.Field>
            <field.Label>Titre</field.Label>
            <field.Content>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  const value = e.target.value;
                  field.handleChange(value);
                  if (!slugEdited) {
                    form.setFieldValue("slug", slugify(value));
                  }
                }}
                placeholder="À propos"
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="slug">
        {(field) => (
          <field.Field>
            <field.Label>Slug</field.Label>
            <field.Content>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  setSlugEdited(true);
                  field.handleChange(e.target.value);
                }}
                placeholder="a-propos"
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="body">
        {(field) => (
          <field.Field>
            <field.Label>Contenu</field.Label>
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
        <form.SubmitButton>
          {isEdit ? "Enregistrer" : "Créer"}
        </form.SubmitButton>
      </div>
    </Form>
  );
}
