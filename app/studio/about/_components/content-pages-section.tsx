"use client";

import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { ContentPageRecord } from "@/query/portfolio/get-about";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteContentPageAction } from "../_actions/content-page.action";
import { ContentPageForm } from "./content-page-form";

type ContentPagesSectionProps = {
  pages: ContentPageRecord[];
};

export function ContentPagesSection({ pages }: ContentPagesSectionProps) {
  const router = useRouter();

  function openForm(page?: ContentPageRecord) {
    const title = page ? "Modifier la page" : "Nouvelle page";
    const id = dialogManager.custom({
      title,
      className: "max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg",
      children: (
        <ContentPageForm
          page={page}
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
        <Button
          variant="default"
          className="rounded-xl"
          onClick={() => openForm()}
        >
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
              className="bg-ios-card flex items-center gap-3 rounded-xl p-3 shadow-sm"
            >
              <div className="flex flex-1 flex-col">
                <Typography as="span" variant="default" className="font-medium">
                  {page.title}
                </Typography>
                <Typography as="span" variant="muted">
                  /{page.slug}
                </Typography>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openForm(page)}
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
    </div>
  );
}
