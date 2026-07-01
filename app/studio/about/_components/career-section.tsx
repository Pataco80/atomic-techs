"use client";

import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { sortCareerEventsChrono } from "@/lib/format/career-order";
import type { CareerEventRecord } from "@/query/portfolio/get-about";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  stackItems: StackItemRecord[];
};

export function CareerSection({ events, stackItems }: CareerSectionProps) {
  const router = useRouter();

  const sorted = sortCareerEventsChrono(events);

  function openForm(event?: CareerEventRecord) {
    const title = event ? "Modifier le poste" : "Nouveau poste";
    const id = dialogManager.custom({
      title,
      className: "max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg",
      children: (
        <CareerForm
          event={event}
          stackItems={stackItems}
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
        <Button
          variant="default"
          className="rounded-xl"
          onClick={() => openForm()}
        >
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
              className="bg-ios-card flex items-center gap-3 rounded-xl p-3 shadow-sm"
            >
              <div className="flex flex-1 flex-col">
                <Typography as="span" variant="default" className="font-medium">
                  {event.jobTitle}
                </Typography>
                <Typography as="span" variant="muted">
                  {event.companyName} · {formatPeriod(event)}
                </Typography>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openForm(event)}
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
    </div>
  );
}
