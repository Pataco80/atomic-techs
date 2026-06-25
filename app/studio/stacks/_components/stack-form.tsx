"use client";

import { Input } from "@/components/ui/input";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createStackAction, updateStackAction } from "../_actions/stack.action";
import {
  StackFormSchema,
  type StackFormValues,
} from "../_actions/stack.schema";

type StackFormProps = {
  stack?: StackItemRecord;
  onSuccess: () => void;
};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function StackForm({ stack, onSuccess }: StackFormProps) {
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
      order: stack?.order ?? 0,
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4">
      <form.AppField name="name">
        {(field) => (
          <field.Field>
            <field.Label>Nom</field.Label>
            <field.Content>
              <field.Input placeholder="React" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="iconSvg">
        {(field) => (
          <field.Field>
            <field.Label>Icône (SVG)</field.Label>
            <field.Content>
              <field.Textarea
                rows={5}
                placeholder="<svg ...>...</svg>"
                className="font-mono text-xs"
              />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="validatedAt">
        {(field) => (
          <field.Field>
            <field.Label>Date de maîtrise</field.Label>
            <field.Content>
              <Input
                type="date"
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
          <field.Field>
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

      <div className="flex justify-end">
        <form.SubmitButton>
          {isEdit ? "Enregistrer" : "Créer"}
        </form.SubmitButton>
      </div>
    </Form>
  );
}
