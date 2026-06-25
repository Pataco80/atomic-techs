"use client";

import { Typography } from "@/components/nowts/typography";
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
import type { ContentPageRecord } from "@/query/portfolio/get-about";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteContentPageAction } from "../_actions/content-page.action";
import { ContentPageForm } from "./content-page-form";

type ContentPagesSectionProps = {
  pages: ContentPageRecord[];
};

export function ContentPagesSection({ pages }: ContentPagesSectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentPageRecord | null>(null);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(page: ContentPageRecord) {
    setEditing(page);
    setOpen(true);
  }

  function handleSuccess() {
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  function confirmDelete(page: ContentPageRecord) {
    dialogManager.confirm({
      title: "Supprimer la page",
      description: `La page « ${page.title} » sera supprimée.`,
      confirmText: "Supprimer",
      action: {
        label: "Supprimer",
        onClick: async () => {
          await resolveActionResult(deleteContentPageAction({ id: page.id }));
          toast.success("Page supprimée");
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
          Nouvelle page
        </Button>
      </div>

      {pages.length === 0 ? (
        <Typography variant="muted">
          Aucune page pour le moment. Cliquez sur « Nouvelle page ».
        </Typography>
      ) : (
        <div className="flex flex-col gap-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-card flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{page.title}</span>
                <span className="text-muted-foreground text-sm">
                  /{page.slug}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(page)}
                aria-label="Modifier"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => confirmDelete(page)}
                aria-label="Supprimer"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier la page" : "Nouvelle page"}
            </DialogTitle>
            <DialogDescription>
              Renseignez le contenu de la page.
            </DialogDescription>
          </DialogHeader>
          <ContentPageForm
            key={editing?.id ?? "new"}
            page={editing ?? undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
