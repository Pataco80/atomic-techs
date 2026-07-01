"use client";

import { GroupedList, ListRow } from "@/components/ios";
import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { computeSeniority } from "@/lib/format/seniority";
import { cn } from "@/lib/utils";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { SortableList, SortableRow } from "@app/studio/_components/sortable";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteStackAction,
  reorderStacksAction,
  toggleStackFeaturedAction,
} from "../_actions/stack.action";
import { StackForm } from "./stack-form";

// UTC-pinned so server and client render the same string (no hydration drift).
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

type StacksListProps = {
  stacks: StackItemRecord[];
};

export function StacksList({ stacks }: StacksListProps) {
  const router = useRouter();
  const [items, setItems] = useState(stacks);

  useEffect(() => {
    setItems(stacks);
  }, [stacks]);

  const featured = items.filter((stack) => stack.featured);
  const rest = items.filter((stack) => !stack.featured);

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) =>
      resolveActionResult(reorderStacksAction({ ids })),
    onSuccess: () => router.refresh(),
    onError: (error) => {
      toast.error(error.message);
      setItems(stacks);
    },
  });

  const featuredMutation = useMutation({
    mutationFn: async (input: { id: string; featured: boolean }) =>
      resolveActionResult(toggleStackFeaturedAction(input)),
    onSuccess: () => router.refresh(),
    onError: (error) => {
      toast.error(error.message);
      setItems(stacks);
    },
  });

  // DnD only reorders the Featured card (this drives the public order).
  function handleReorder(orderedIds: string[]) {
    const byId = new Map(items.map((stack) => [stack.id, stack]));
    const orderedFeatured = orderedIds
      .map((id) => byId.get(id))
      .filter((stack): stack is StackItemRecord => Boolean(stack));
    setItems([...orderedFeatured, ...rest]);
    reorderMutation.mutate(orderedIds);
  }

  function toggleFeatured(stack: StackItemRecord) {
    const next = !stack.featured;
    setItems(
      items.map((item) =>
        item.id === stack.id ? { ...item, featured: next } : item,
      ),
    );
    featuredMutation.mutate({ id: stack.id, featured: next });
  }

  function openForm(stack?: StackItemRecord) {
    const title = stack ? "Modifier la stack" : "Nouvelle stack";
    const id = dialogManager.custom({
      title,
      className: "max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg",
      children: (
        <StackForm
          stack={stack}
          title={title}
          onCancel={() => dialogManager.close(id)}
          onSuccess={() => {
            dialogManager.close(id);
            router.refresh();
          }}
        />
      ),
    });
  }

  function confirmDelete(stack: StackItemRecord) {
    dialogManager.confirm({
      title: "Supprimer la stack",
      description: `« ${stack.name} » sera supprimée du portfolio.`,
      confirmText: "Supprimer",
      action: {
        label: "Supprimer",
        onClick: async () => {
          await resolveActionResult(deleteStackAction({ id: stack.id }));
          toast.success("Stack supprimée");
          router.refresh();
        },
      },
    });
  }

  function renderRow(stack: StackItemRecord, dragHandle?: ReactNode) {
    return (
      <ListRow
        key={stack.id}
        leading={
          <div className="flex items-center gap-2">
            {dragHandle}
            <div
              className="flex size-8 shrink-0 items-center justify-center [&>svg]:size-6"
              // Admin-authored SVG icon (single-owner back-office).
              dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
            />
          </div>
        }
        title={stack.name}
        subtitle={`Depuis ${dateFormatter.format(stack.validatedAt)}`}
        trailing={
          <div className="flex items-center gap-1">
            <Badge variant="secondary">
              {computeSeniority(stack.validatedAt)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFeatured(stack)}
              aria-label={
                stack.featured
                  ? "Retirer des mises en avant"
                  : "Mettre en avant"
              }
              aria-pressed={stack.featured}
            >
              <Star
                className={cn(
                  "size-4",
                  stack.featured && "fill-current text-amber-500",
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openForm(stack)}
              aria-label="Modifier"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => confirmDelete(stack)}
              aria-label="Supprimer"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end">
        <Button
          variant="default"
          className="rounded-xl"
          onClick={() => openForm()}
        >
          <Plus className="size-4" />
          Nouvelle stack
        </Button>
      </div>

      {items.length === 0 ? (
        <Typography variant="muted">
          Aucune stack pour le moment. Cliquez sur « Nouvelle stack ».
        </Typography>
      ) : (
        <>
          <SortableList
            items={featured.map((s) => s.id)}
            onReorder={handleReorder}
          >
            <GroupedList
              header="Featured Stacks"
              footer="Glissez pour ordonner — cet ordre est celui de la page d'accueil."
            >
              {featured.length === 0 ? (
                <div className="px-4 py-3">
                  <Typography variant="muted">
                    Aucune stack mise en avant. Activez l'étoile sur une stack
                    ci-dessous.
                  </Typography>
                </div>
              ) : (
                featured.map((stack) => (
                  <SortableRow key={stack.id} id={stack.id}>
                    {(handle) => renderRow(stack, handle)}
                  </SortableRow>
                ))
              )}
            </GroupedList>
          </SortableList>

          {rest.length > 0 && (
            <GroupedList header="Stacks">
              {rest.map((stack) => renderRow(stack))}
            </GroupedList>
          )}
        </>
      )}
    </div>
  );
}
