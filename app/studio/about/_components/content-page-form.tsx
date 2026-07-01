"use client";

import { RichTextEditor } from "@/components/nowts/rich-text-editor";
import {
  GroupedList,
  IosSheetHeader,
  iosSheetCancelButton,
  iosSheetSubmitButton,
} from "@/components/ios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { slugify } from "@/lib/format/slugify";
import type { ContentPageRecord } from "@/query/portfolio/get-about";
import type { JSONContent } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
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

const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";
const iosRow = "relative gap-1.5 px-4 py-3";

type ContentPageFormProps = {
  page?: ContentPageRecord;
  title: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function ContentPageForm({
  page,
  title,
  onCancel,
  onSuccess,
}: ContentPageFormProps) {
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
    <Form form={form} className="flex w-full flex-col">
      <IosSheetHeader
        title={title}
        leading={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Annuler"
            onClick={onCancel}
            className={iosSheetCancelButton}
          >
            <X />
          </Button>
        }
        trailing={
          <form.SubmitButton
            variant="ghost"
            size="icon"
            aria-label={isEdit ? "Enregistrer" : "Créer"}
            className={iosSheetSubmitButton}
          >
            <Check />
          </form.SubmitButton>
        }
      />

      <div className="flex flex-col gap-8 p-4">
        <GroupedList header="Page">
          <form.AppField name="title">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">Titre</field.Label>
                <field.Content>
                  <Input
                    className={iosInput}
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
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">Slug</field.Label>
                <field.Content>
                  <Input
                    className={iosInput}
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
        </GroupedList>

        <GroupedList header="Contenu">
          <form.AppField name="body">
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
      </div>
    </Form>
  );
}
