"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ImageUploadField } from "@app/studio/_components/image-upload-field";
import { SortableList, SortableRow } from "@app/studio/_components/sortable";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/nowts/typography";
import type { GalleryItemValues } from "../_actions/project.schema";
import { Plus, Trash2 } from "lucide-react";

// Borderless input that sits flush inside the row card (mirrors project-form).
const iosInput =
  "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent";

const emptyItem: GalleryItemValues = {
  imageUrl: "",
  title: "",
  shortDescription: "",
};

type GalleryEditorProps = {
  // TanStack form instance — typed loosely (like the shared form layer) so that
  // dynamic `galleryItems[i].*` field names don't fight `DeepKeys` inference.
  form: any;
};

/**
 * Drag-and-drop editor for a project's gallery. Each row is an image uploader
 * plus a title (the lightbox caption) and a short description. Row order maps
 * directly to the persisted `order` (see `withOrder` in the server action).
 */
export function GalleryEditor({ form }: GalleryEditorProps) {
  return (
    <form.AppField name="galleryItems" mode="array">
      {(field: any) => {
        const items = (field.state.value ?? []) as GalleryItemValues[];
        const ids = items.map((_, index) => String(index));

        return (
          <div className="flex flex-col gap-4 px-4 py-3">
            {items.length === 0 ? (
              <Typography variant="muted" className="text-ios-secondary-label">
                Aucune image. Ajoutez-en pour créer la galerie.
              </Typography>
            ) : (
              <SortableList
                items={ids}
                onReorder={(orderedIds) =>
                  field.handleChange(orderedIds.map((id) => items[Number(id)]))
                }
              >
                <div className="flex flex-col gap-4">
                  {items.map((_, index) => (
                    <SortableRow key={index} id={String(index)}>
                      {(handle) => (
                        <div className="bg-background border-ios-separator flex gap-3 rounded-xl border p-3">
                          <div className="flex flex-col items-center pt-1">
                            {handle}
                          </div>

                          <div className="flex flex-1 flex-col gap-3">
                            <form.AppField
                              name={`galleryItems[${index}].imageUrl`}
                            >
                              {(f: any) => (
                                <f.Field className="gap-2">
                                  <f.Content>
                                    <ImageUploadField
                                      value={f.state.value}
                                      onChange={(url) =>
                                        f.handleChange(url ?? "")
                                      }
                                    />
                                    <f.Message />
                                  </f.Content>
                                </f.Field>
                              )}
                            </form.AppField>

                            <form.AppField
                              name={`galleryItems[${index}].title`}
                            >
                              {(f: any) => (
                                <f.Field className="gap-1.5">
                                  <f.Label className="text-ios-label">
                                    Titre
                                  </f.Label>
                                  <f.Content>
                                    <f.Input
                                      className={iosInput}
                                      placeholder="Titre de l'image"
                                    />
                                    <f.Message />
                                  </f.Content>
                                </f.Field>
                              )}
                            </form.AppField>

                            <form.AppField
                              name={`galleryItems[${index}].shortDescription`}
                            >
                              {(f: any) => (
                                <f.Field className="gap-1.5">
                                  <f.Label className="text-ios-label">
                                    Description courte
                                  </f.Label>
                                  <f.Content>
                                    <f.Textarea
                                      rows={2}
                                      className={iosInput}
                                      placeholder="Courte description"
                                    />
                                    <f.Message />
                                  </f.Content>
                                </f.Field>
                              )}
                            </form.AppField>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Retirer l'image"
                            onClick={() => field.removeValue(index)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      )}
                    </SortableRow>
                  ))}
                </div>
              </SortableList>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => field.pushValue(emptyItem)}
            >
              <Plus />
              Ajouter une image
            </Button>
          </div>
        );
      }}
    </form.AppField>
  );
}
