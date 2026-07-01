"use client";

import { GroupedList, ListRow } from "@/components/ios";
import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { cn } from "@/lib/utils";
import type { ProjectWithStacks } from "@/query/portfolio/get-projects";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { SortableList, SortableRow } from "@app/studio/_components/sortable";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteProjectAction,
  reorderProjectsAction,
  toggleProjectFeaturedAction,
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

  const featured = items.filter((project) => project.featured);
  const rest = items.filter((project) => !project.featured);

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) =>
      resolveActionResult(reorderProjectsAction({ ids })),
    onSuccess: () => router.refresh(),
    onError: (error) => {
      toast.error(error.message);
      setItems(projects);
    },
  });

  const featuredMutation = useMutation({
    mutationFn: async (input: { id: string; featured: boolean }) =>
      resolveActionResult(toggleProjectFeaturedAction(input)),
    onSuccess: () => router.refresh(),
    onError: (error) => {
      toast.error(error.message);
      setItems(projects);
    },
  });

  // DnD only reorders the Featured card (this drives the public order).
  function handleReorder(orderedIds: string[]) {
    const byId = new Map(items.map((project) => [project.id, project]));
    const orderedFeatured = orderedIds
      .map((id) => byId.get(id))
      .filter((project): project is ProjectWithStacks => Boolean(project));
    setItems([...orderedFeatured, ...rest]);
    reorderMutation.mutate(orderedIds);
  }

  function toggleFeatured(project: ProjectWithStacks) {
    const next = !project.featured;
    setItems(
      items.map((item) =>
        item.id === project.id ? { ...item, featured: next } : item,
      ),
    );
    featuredMutation.mutate({ id: project.id, featured: next });
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

  function renderRow(project: ProjectWithStacks, dragHandle?: ReactNode) {
    return (
      <ListRow
        key={project.id}
        leading={dragHandle}
        title={project.title}
        subtitle={`/${project.slug} · ${project.stacks.length} techno${
          project.stacks.length > 1 ? "s" : ""
        }`}
        trailing={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFeatured(project)}
              aria-label={
                project.featured
                  ? "Retirer des mises en avant"
                  : "Mettre en avant"
              }
              aria-pressed={project.featured}
            >
              <Star
                className={cn(
                  "size-4",
                  project.featured && "fill-current text-amber-500",
                )}
              />
            </Button>
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
          Nouveau projet
        </Button>
      </div>

      {items.length === 0 ? (
        <Typography variant="muted">
          Aucun projet pour le moment. Cliquez sur « Nouveau projet ».
        </Typography>
      ) : (
        <>
          <SortableList
            items={featured.map((p) => p.id)}
            onReorder={handleReorder}
          >
            <GroupedList
              header="Featured Projects"
              footer="Glissez pour ordonner — cet ordre est celui de la page d'accueil et du tri /portfolio."
            >
              {featured.length === 0 ? (
                <div className="px-4 py-3">
                  <Typography variant="muted">
                    Aucun projet mis en avant. Activez l'étoile sur un projet
                    ci-dessous.
                  </Typography>
                </div>
              ) : (
                featured.map((project) => (
                  <SortableRow key={project.id} id={project.id}>
                    {(handle) => renderRow(project, handle)}
                  </SortableRow>
                ))
              )}
            </GroupedList>
          </SortableList>

          {rest.length > 0 && (
            <GroupedList header="Projets">
              {rest.map((project) => renderRow(project))}
            </GroupedList>
          )}
        </>
      )}
    </div>
  );
}
