"use client";

import { RichTextEditor } from "@/components/nowts/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { CareerEventRecord } from "@/query/portfolio/get-about";
import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import type { JSONContent } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  createCareerEventAction,
  updateCareerEventAction,
} from "../_actions/career.action";
import {
  CareerEventSchema,
  type CareerEventValues,
} from "../_actions/career.schema";

type CareerFormProps = {
  event?: CareerEventRecord;
  onSuccess: () => void;
};

export function CareerForm({ event, onSuccess }: CareerFormProps) {
  const isEdit = Boolean(event);
  const currentYear = new Date().getFullYear();
  const [isCurrent, setIsCurrent] = useState(
    event ? event.endYear == null : true,
  );

  const mutation = useMutation({
    mutationFn: async (values: CareerEventValues) =>
      resolveActionResult(
        event
          ? updateCareerEventAction({ ...values, id: event.id })
          : createCareerEventAction(values),
      ),
    onSuccess: () => {
      toast.success(isEdit ? "Poste mis à jour" : "Poste créé");
      onSuccess();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: CareerEventSchema,
    defaultValues: {
      jobTitle: event?.jobTitle ?? "",
      companyName: event?.companyName ?? "",
      companyLogo: event?.companyLogo ?? null,
      startMonth: event?.startMonth ?? 1,
      startYear: event?.startYear ?? currentYear,
      endMonth: event?.endMonth ?? null,
      endYear: event?.endYear ?? null,
      description: (event?.description ?? null) as JSONContent | null,
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  function handleCurrentChange(checked: boolean) {
    setIsCurrent(checked);
    if (checked) {
      form.setFieldValue("endMonth", null);
      form.setFieldValue("endYear", null);
    } else {
      form.setFieldValue("endMonth", 1);
      form.setFieldValue("endYear", currentYear);
    }
  }

  return (
    <Form form={form} className="flex flex-col gap-4">
      <form.AppField name="jobTitle">
        {(field) => (
          <field.Field>
            <field.Label>Poste</field.Label>
            <field.Content>
              <field.Input placeholder="Développeur Front-End" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="companyName">
        {(field) => (
          <field.Field>
            <field.Label>Entreprise</field.Label>
            <field.Content>
              <field.Input placeholder="Atomic Techs" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="companyLogo">
        {(field) => (
          <field.Field>
            <field.Label>Logo de l'entreprise</field.Label>
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
        <form.AppField name="startMonth">
          {(field) => (
            <field.Field>
              <field.Label>Mois de début (1-12)</field.Label>
              <field.Content>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber)
                        ? 0
                        : e.target.valueAsNumber,
                    )
                  }
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>

        <form.AppField name="startYear">
          {(field) => (
            <field.Field>
              <field.Label>Année de début</field.Label>
              <field.Content>
                <Input
                  type="number"
                  min={1900}
                  max={2100}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber)
                        ? 0
                        : e.target.valueAsNumber,
                    )
                  }
                />
                <field.Message />
              </field.Content>
            </field.Field>
          )}
        </form.AppField>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="career-current"
          checked={isCurrent}
          onCheckedChange={handleCurrentChange}
        />
        <Label htmlFor="career-current">Poste actuel</Label>
      </div>

      {!isCurrent && (
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="endMonth">
            {(field) => (
              <field.Field>
                <field.Label>Mois de fin (1-12)</field.Label>
                <field.Content>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        Number.isNaN(e.target.valueAsNumber)
                          ? null
                          : e.target.valueAsNumber,
                      )
                    }
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="endYear">
            {(field) => (
              <field.Field>
                <field.Label>Année de fin</field.Label>
                <field.Content>
                  <Input
                    type="number"
                    min={1900}
                    max={2100}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        Number.isNaN(e.target.valueAsNumber)
                          ? null
                          : e.target.valueAsNumber,
                      )
                    }
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
        </div>
      )}

      <form.AppField name="description">
        {(field) => (
          <field.Field>
            <field.Label>Description</field.Label>
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
