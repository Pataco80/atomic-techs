"use client";

import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { SortableItem, SortableList } from "@app/studio/_components/sortable";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteProjectAction,
  reorderProjectsAction,
} from "../_actions/project.action";
import { ProjectForm } from "./project-form";

type ProjectsListProps = {
  projects: ProjectWithStacks[];
  stackItems: StackItemRecord[];
};

export function ProjectsList({ projects, stackItems }: ProjectsListProps) {
  const router = useRouter();
  const [items, setItems] = useState(projects);

  // Re-sync from the server whenever the source data changes (after refresh).
  useEffect(() => {
    setItems(projects);
  }, [projects]);

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) =>
      resolveActionResult(reorderProjectsAction({ ids })),
    onSuccess: () => router.refresh(),
    onError: (error) => {
      toast.error(error.message);
      setItems(projects);
    },
  });

  function handleReorder(orderedIds: string[]) {
    const byId = new Map(items.map((project) => [project.id, project]));
    setItems(
      orderedIds
        .map((id) => byId.get(id))
        .filter((project): project is ProjectWithStacks => Boolean(project)),
    );
    reorderMutation.mutate(orderedIds);
  }

  function openForm(project?: ProjectWithStacks) {
    const title = project ? "Modifier le projet" : "Nouveau projet";
    const id = dialogManager.custom({
      title,
      className: "max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl",
      children: (
        <ProjectForm
          project={project}
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

  function confirmDelete(project: ProjectWithStacks) {
    dialogManager.confirm({
      title: "Supprimer le projet",
      description: `« ${project.title} » sera supprimé du portfolio.`,
      confirmText: "Supprimer",
      action: {
        label: "Supprimer",
        onClick: async () => {
          await resolveActionResult(deleteProjectAction({ id: project.id }));
          toast.success("Projet supprimé");
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
          Nouveau projet
        </Button>
      </div>

      {items.length === 0 ? (
        <Typography variant="muted">
          Aucun projet pour le moment. Cliquez sur « Nouveau projet ».
        </Typography>
      ) : (
        <SortableList items={items.map((p) => p.id)} onReorder={handleReorder}>
          <div className="flex flex-col gap-2">
            {items.map((project) => (
              <SortableItem key={project.id} id={project.id}>
                <div className="bg-ios-card flex items-center gap-3 rounded-xl p-3 shadow-sm">
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <Typography
                        as="span"
                        variant="default"
                        className="font-medium"
                      >
                        {project.title}
                      </Typography>
                      {project.featured && (
                        <Badge variant="secondary">
                          <Star className="size-3" />
                          En avant
                        </Badge>
                      )}
                    </div>
                    <Typography as="span" variant="muted">
                      /{project.slug} · {project.stacks.length} techno
                      {project.stacks.length > 1 ? "s" : ""}
                    </Typography>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openForm(project)}
                    aria-label="Modifier"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(project)}
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
    </div>
  );
}
