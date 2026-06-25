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
import { sortCareerEventsChrono } from "@/lib/format/career-order";
import type { CareerEventRecord } from "@/query/portfolio/get-about";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCareerEventAction } from "../_actions/career.action";
import { CareerForm } from "./career-form";

// Static French month labels — deterministic across server/client (no Intl,
// so no hydration drift).
const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function formatMonthYear(month: number, year: number): string {
  return `${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

function formatPeriod(event: CareerEventRecord): string {
  const start = formatMonthYear(event.startMonth, event.startYear);
  const end =
    event.endYear == null
      ? "Aujourd'hui"
      : formatMonthYear(event.endMonth ?? 1, event.endYear);
  return `${start} – ${end}`;
}

type CareerSectionProps = {
  events: CareerEventRecord[];
};

export function CareerSection({ events }: CareerSectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CareerEventRecord | null>(null);

  const sorted = sortCareerEventsChrono(events);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(event: CareerEventRecord) {
    setEditing(event);
    setOpen(true);
  }

  function handleSuccess() {
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  function confirmDelete(event: CareerEventRecord) {
    dialogManager.confirm({
      title: "Supprimer le poste",
      description: `« ${event.jobTitle} » chez ${event.companyName} sera supprimé.`,
      confirmText: "Supprimer",
      action: {
        label: "Supprimer",
        onClick: async () => {
          await resolveActionResult(deleteCareerEventAction({ id: event.id }));
          toast.success("Poste supprimé");
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
          Nouveau poste
        </Button>
      </div>

      {sorted.length === 0 ? (
        <Typography variant="muted">
          Aucun poste pour le moment. Cliquez sur « Nouveau poste ».
        </Typography>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((event) => (
            <div
              key={event.id}
              className="bg-card flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{event.jobTitle}</span>
                <span className="text-muted-foreground text-sm">
                  {event.companyName} · {formatPeriod(event)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(event)}
                aria-label="Modifier"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => confirmDelete(event)}
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
              {editing ? "Modifier le poste" : "Nouveau poste"}
            </DialogTitle>
            <DialogDescription>
              Renseignez les informations du poste.
            </DialogDescription>
          </DialogHeader>
          <CareerForm
            key={editing?.id ?? "new"}
            event={editing ?? undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
