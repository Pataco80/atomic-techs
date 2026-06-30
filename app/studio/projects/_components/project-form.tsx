"use client";

import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import {
  GroupedList,
  IosSheetHeader,
  Toggle,
  iosSheetCancelButton,
  iosSheetSubmitButton,
} from "@/components/ios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/nowts/typography";
import { useForm } from "@/features/form/tanstack-form";
import { Check, X } from "lucide-react";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { slugify } from "@/lib/format/slugify";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  createProjectAction,
  updateProjectAction,
} from "../_actions/project.action";
import {
  ProjectFormSchema,
  type ProjectFormValues,
} from "../_actions/project.schema";

type ProjectFormProps = {
  stackItems: StackItemRecord[];
  project?: ProjectWithStacks;
  title: string;
  onCancel: () => void;
  onSuccess: () => void;
};

// Borderless input that sits flush inside an iOS grouped-list row.
const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";
const iosRow = "relative gap-1.5 px-4 py-3";

export function ProjectForm({
  stackItems,
  project,
  title,
  onCancel,
  onSuccess,
}: ProjectFormProps) {
  const isEdit = Boolean(project);
  const [slugEdited, setSlugEdited] = useState(isEdit);

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormValues) =>
      resolveActionResult(
        project
          ? updateProjectAction({ ...values, id: project.id })
          : createProjectAction(values),
      ),
    onSuccess: () => {
      toast.success(isEdit ? "Projet mis à jour" : "Projet créé");
      onSuccess();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: ProjectFormSchema,
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      longDescription: project?.longDescription ?? "",
      imageUrl: project?.imageUrl ?? null,
      liveUrl: project?.liveUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      featured: project?.featured ?? false,
      order: project?.order ?? 0,
      stackItemIds: project?.stacks.map((s) => s.stackItemId) ?? [],
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <form.AppForm>
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
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
          <GroupedList header="Projet">
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
                    />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="longDescription">
              {(field) => (
                <field.Field className={iosRow}>
                  <field.Label className="text-ios-label">
                    Description
                  </field.Label>
                  <field.Content>
                    <field.Textarea
                      rows={4}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                    />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>
          </GroupedList>

          <GroupedList header="Image">
            <form.AppField name="imageUrl">
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

          <GroupedList header="Liens">
            <form.AppField name="liveUrl">
              {(field) => (
                <field.Field className={iosRow}>
                  <field.Label className="text-ios-label">
                    URL en ligne
                  </field.Label>
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

            <form.AppField name="githubUrl">
              {(field) => (
                <field.Field className={iosRow}>
                  <field.Label className="text-ios-label">
                    URL GitHub
                  </field.Label>
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
          </GroupedList>

          <GroupedList
            header="Technos"
            footer="Sélectionnez les technologies utilisées dans ce projet."
          >
            <form.AppField name="stackItemIds">
              {(field) => {
                const selected = field.state.value;
                return (
                  <field.Field className="relative gap-2 px-4 py-3">
                    {stackItems.length === 0 ? (
                      <Typography
                        variant="muted"
                        className="text-ios-secondary-label"
                      >
                        Aucune stack disponible. Créez-en dans l'onglet Stacks.
                      </Typography>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {stackItems.map((item) => {
                          const checked = selected.includes(item.id);
                          return (
                            <label
                              key={item.id}
                              className="border-ios-separator hover:bg-ios-separator/30 flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) =>
                                  field.handleChange(
                                    value
                                      ? [...selected, item.id]
                                      : selected.filter((id) => id !== item.id),
                                  )
                                }
                              />
                              <span>{item.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    <field.Message />
                  </field.Field>
                );
              }}
            </form.AppField>
          </GroupedList>

          <GroupedList header="Options">
            <form.AppField name="order">
              {(field) => (
                <field.Field className={iosRow}>
                  <field.Label className="text-ios-label">Ordre</field.Label>
                  <field.Content>
                    <Input
                      type="number"
                      min={0}
                      className={iosInput}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber || 0)
                      }
                    />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </form.AppField>

            <form.AppField name="featured">
              {(field) => (
                <field.Field
                  orientation="horizontal"
                  className="relative min-h-11 items-center justify-between px-4 py-2.5"
                >
                  <field.Label className="text-ios-label">
                    Mis en avant
                  </field.Label>
                  <Toggle
                    checked={Boolean(field.state.value)}
                    onCheckedChange={(value) => field.handleChange(value)}
                  />
                </field.Field>
              )}
            </form.AppField>
          </GroupedList>
        </div>
      </form>
    </form.AppForm>
  );
}
