"use client";

import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { computeSeniority } from "@/lib/format/seniority";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { SortableItem, SortableList } from "@app/studio/_components/sortable";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteStackAction,
  reorderStacksAction,
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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StackItemRecord | null>(null);

  useEffect(() => {
    setItems(stacks);
  }, [stacks]);

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) =>
      resolveActionResult(reorderStacksAction({ ids })),
    onSuccess: () => router.refresh(),
    onError: (error) => {
      toast.error(error.message);
      setItems(stacks);
    },
  });

  function handleReorder(orderedIds: string[]) {
    const byId = new Map(items.map((stack) => [stack.id, stack]));
    setItems(
      orderedIds
        .map((id) => byId.get(id))
        .filter((stack): stack is StackItemRecord => Boolean(stack)),
    );
    reorderMutation.mutate(orderedIds);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(stack: StackItemRecord) {
    setEditing(stack);
    setOpen(true);
  }

  function handleSuccess() {
    setOpen(false);
    setEditing(null);
    router.refresh();
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Nouvelle stack
        </Button>
      </div>

      {items.length === 0 ? (
        <Typography variant="muted">
          Aucune stack pour le moment. Cliquez sur « Nouvelle stack ».
        </Typography>
      ) : (
        <SortableList items={items.map((s) => s.id)} onReorder={handleReorder}>
          <div className="flex flex-col gap-2">
            {items.map((stack) => (
              <SortableItem key={stack.id} id={stack.id}>
                <div className="bg-card flex items-center gap-3 rounded-lg border p-3">
                  <div
                    className="flex size-8 shrink-0 items-center justify-center [&>svg]:size-6"
                    // Admin-authored SVG icon (single-owner back-office).
                    dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{stack.name}</span>
                    <span className="text-muted-foreground text-sm">
                      Depuis {dateFormatter.format(stack.validatedAt)}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {computeSeniority(stack.validatedAt)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(stack)}
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
              </SortableItem>
            ))}
          </div>
        </SortableList>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier la stack" : "Nouvelle stack"}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations de la stack.
            </DialogDescription>
          </DialogHeader>
          <StackForm
            key={editing?.id ?? "new"}
            stack={editing ?? undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
