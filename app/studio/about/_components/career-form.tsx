"use client";

import { RichTextEditor } from "@/components/nowts/rich-text-editor";
import {
  GroupedList,
  IosSheetHeader,
  Toggle,
  iosSheetCancelButton,
  iosSheetSubmitButton,
} from "@/components/ios";
import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { CareerEventRecord } from "@/query/portfolio/get-about";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import { StackCombobox } from "@app/studio/_components/stack-combobox";
import type { JSONContent } from "@tiptap/react";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
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

const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";
const iosRow = "relative gap-1.5 px-4 py-3";

type CareerFormProps = {
  event?: CareerEventRecord;
  stackItems: StackItemRecord[];
  title: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function CareerForm({
  event,
  stackItems,
  title,
  onCancel,
  onSuccess,
}: CareerFormProps) {
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
      stackItemIds: event?.stacks.map((s) => s.stackItemId) ?? [],
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
        <GroupedList header="Poste">
          <form.AppField name="jobTitle">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">Poste</field.Label>
                <field.Content>
                  <field.Input
                    className={iosInput}
                    placeholder="Développeur Front-End"
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="companyName">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">Entreprise</field.Label>
                <field.Content>
                  <field.Input
                    className={iosInput}
                    placeholder="Atomic Techs"
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
        </GroupedList>

        <GroupedList header="Logo de l'entreprise">
          <form.AppField name="companyLogo">
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

        <GroupedList header="Période">
          <form.AppField name="startMonth">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">
                  Mois de début (1-12)
                </field.Label>
                <field.Content>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    className={iosInput}
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
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">
                  Année de début
                </field.Label>
                <field.Content>
                  <Input
                    type="number"
                    min={1900}
                    max={2100}
                    className={iosInput}
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

          <div className="relative flex min-h-11 items-center justify-between px-4 py-2.5">
            <Label htmlFor="career-current" className="text-ios-label">
              Poste actuel
            </Label>
            <Toggle
              id="career-current"
              checked={isCurrent}
              onCheckedChange={handleCurrentChange}
            />
          </div>

          {!isCurrent && (
            <>
              <form.AppField name="endMonth">
                {(field) => (
                  <field.Field className={iosRow}>
                    <field.Label className="text-ios-label">
                      Mois de fin (1-12)
                    </field.Label>
                    <field.Content>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        className={iosInput}
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
                  <field.Field className={iosRow}>
                    <field.Label className="text-ios-label">
                      Année de fin
                    </field.Label>
                    <field.Content>
                      <Input
                        type="number"
                        min={1900}
                        max={2100}
                        className={iosInput}
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
            </>
          )}
        </GroupedList>

        <GroupedList header="Description">
          <form.AppField name="description">
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

        <GroupedList
          header="Stacks et logiciels"
          footer="Les technologies et logiciels utilisés pendant ce poste."
        >
          <form.AppField name="stackItemIds">
            {(field) => (
              <field.Field className="relative gap-2 px-4 py-3">
                {stackItems.length === 0 ? (
                  <Typography
                    variant="muted"
                    className="text-ios-secondary-label"
                  >
                    Aucune stack disponible. Créez-en dans l'onglet Stacks.
                  </Typography>
                ) : (
                  <StackCombobox
                    stackItems={stackItems}
                    selectedIds={field.state.value}
                    onChange={(ids) => field.handleChange(ids)}
                    onBlur={field.handleBlur}
                  />
                )}
                <field.Message />
              </field.Field>
            )}
          </form.AppField>
        </GroupedList>
      </div>
    </Form>
  );
}
