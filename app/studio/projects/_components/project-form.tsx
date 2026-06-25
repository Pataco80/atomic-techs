"use client";

import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/nowts/typography";
import { useForm } from "@/features/form/tanstack-form";
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
  onSuccess: () => void;
};

export function ProjectForm({
  stackItems,
  project,
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
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
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
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="longDescription">
          {(field) => (
            <field.Field>
              <field.Label>Description</field.Label>
              <field.Content>
                <field.Textarea rows={4} />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="imageUrl">
          {(field) => (
            <field.Field>
              <field.Label>Image</field.Label>
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

        <form.AppField name="liveUrl">
          {(field) => (
            <field.Field>
              <field.Label>URL en ligne</field.Label>
              <field.Content>
                <field.Input placeholder="https://exemple.com" />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="githubUrl">
          {(field) => (
            <field.Field>
              <field.Label>URL GitHub</field.Label>
              <field.Content>
                <field.Input placeholder="https://github.com/..." />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="stackItemIds">
          {(field) => {
            const selected = field.state.value;
            return (
              <field.Field>
                <field.Label>Technos</field.Label>
                {stackItems.length === 0 ? (
                  <Typography variant="muted">
                    Aucune stack disponible. Créez-en dans l'onglet Stacks.
                  </Typography>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {stackItems.map((item) => {
                      const checked = selected.includes(item.id);
                      return (
                        <label
                          key={item.id}
                          className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
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

        <div className="flex gap-4">
          <form.AppField name="order">
            {(field) => (
              <field.Field className="flex-1">
                <field.Label>Ordre</field.Label>
                <field.Content>
                  <Input
                    type="number"
                    min={0}
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
              <field.Field className="flex-1">
                <field.Label>Mis en avant</field.Label>
                <field.Content>
                  <field.Switch />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
        </div>

        <div className="flex justify-end">
          <form.SubmitButton>
            {isEdit ? "Enregistrer" : "Créer"}
          </form.SubmitButton>
        </div>
      </form>
    </form.AppForm>
  );
}
