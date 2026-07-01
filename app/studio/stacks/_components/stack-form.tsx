"use client";

import {
  GroupedList,
  IosSheetHeader,
  Toggle,
  iosSheetCancelButton,
  iosSheetSubmitButton,
} from "@/components/ios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { createStackAction, updateStackAction } from "../_actions/stack.action";
import {
  StackFormSchema,
  type StackFormValues,
} from "../_actions/stack.schema";

const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";
const iosRow = "relative gap-1.5 px-4 py-3";

type StackFormProps = {
  stack?: StackItemRecord;
  title: string;
  onCancel: () => void;
  onSuccess: () => void;
};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function StackForm({
  stack,
  title,
  onCancel,
  onSuccess,
}: StackFormProps) {
  const isEdit = Boolean(stack);

  const mutation = useMutation({
    mutationFn: async (values: StackFormValues) =>
      resolveActionResult(
        stack
          ? updateStackAction({ ...values, id: stack.id })
          : createStackAction(values),
      ),
    onSuccess: () => {
      toast.success(isEdit ? "Stack mise à jour" : "Stack créée");
      onSuccess();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    schema: StackFormSchema,
    defaultValues: {
      name: stack?.name ?? "",
      iconSvg: stack?.iconSvg ?? "",
      validatedAt: stack ? toDateInputValue(stack.validatedAt) : "",
      featured: stack?.featured ?? false,
      order: stack?.order ?? 0,
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
        <GroupedList
          header="Stack"
          footer="Collez le code SVG de l'icône (sera affichée dans le portfolio)."
        >
          <form.AppField name="name">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">Nom</field.Label>
                <field.Content>
                  <field.Input className={iosInput} placeholder="React" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.AppField name="iconSvg">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">
                  Icône (SVG)
                </field.Label>
                <field.Content>
                  <field.Textarea
                    rows={5}
                    placeholder="<svg ...>...</svg>"
                    className="border-0 bg-transparent px-0 font-mono text-xs shadow-none focus-visible:ring-0 dark:bg-transparent"
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
        </GroupedList>

        <GroupedList header="Détails">
          <form.AppField name="validatedAt">
            {(field) => (
              <field.Field className={iosRow}>
                <field.Label className="text-ios-label">
                  Date de maîtrise
                </field.Label>
                <field.Content>
                  <Input
                    type="date"
                    className={iosInput}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

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
        </GroupedList>

        <GroupedList
          header="Options"
          footer="Les stacks « mises en avant » sont les seules affichées sur la page d'accueil, dans l'ordre défini ici."
        >
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
    </Form>
  );
}
