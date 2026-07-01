"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

/** Lowercase + strip accents so "réseau" matches "reseau". */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

type StackComboboxProps = {
  stackItems: StackItemRecord[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onBlur?: () => void;
};

/** A selected stack rendered as a light, draggable inline badge. */
function SortableBadge({
  stack,
  onRemove,
}: {
  stack: StackItemRecord;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stack.id });

  return (
    <span
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        badgeVariants({ variant: "secondary" }),
        "cursor-grab touch-none gap-1 pr-1 active:cursor-grabbing",
        isDragging && "z-10 opacity-70",
      )}
      {...attributes}
      {...listeners}
    >
      {stack.name}
      <button
        type="button"
        aria-label={`Retirer ${stack.name}`}
        className="hover:bg-foreground/10 focus-visible:ring-ring rounded-full p-0.5 focus-visible:ring-2 focus-visible:outline-none"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onRemove(stack.id)}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

/**
 * Filterable tag-input for selecting existing stacks (no create-on-the-fly).
 * Click or Enter adds the highlighted match. Selected stacks are shown as light
 * inline badges below the input and can be reordered by drag-and-drop (their
 * order = the `stackItemIds` order). Built on cmdk for WCAG combobox semantics
 * (input role=combobox, list role=listbox, items role=option,
 * aria-activedescendant). The matches list is in-flow (not absolutely
 * positioned) so it is never clipped by the grouped-list card.
 */
export function StackCombobox({
  stackItems,
  selectedIds,
  onChange,
  onBlur,
}: StackComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const byId = useMemo(
    () => new Map(stackItems.map((stack) => [stack.id, stack])),
    [stackItems],
  );
  const selected = selectedIds
    .map((id) => byId.get(id))
    .filter((stack): stack is StackItemRecord => Boolean(stack));

  const matches = useMemo(() => {
    const q = normalize(query);
    return stackItems
      .filter((stack) => !selectedIds.includes(stack.id))
      .filter((stack) => (q === "" ? true : normalize(stack.name).includes(q)));
  }, [stackItems, selectedIds, query]);

  function add(id: string) {
    if (selectedIds.includes(id)) return;
    onChange([...selectedIds, id]);
    setQuery("");
  }

  function remove(id: string) {
    onChange(selectedIds.filter((value) => value !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = selectedIds.indexOf(String(active.id));
    const newIndex = selectedIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(selectedIds, oldIndex, newIndex));
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (containerRef.current?.contains(event.relatedTarget)) return;
    setOpen(false);
    onBlur?.();
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <CommandPrimitive
        ref={containerRef}
        shouldFilter={false}
        onBlur={handleBlur}
        className="w-full bg-transparent"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }
        }}
      >
        <div
          className="border-ios-separator focus-within:border-ring/60 bg-background flex items-center gap-2 rounded-xl border px-3 py-2"
          onClick={() => inputRef.current?.focus()}
        >
          <CommandPrimitive.Input
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            onFocus={() => setOpen(true)}
            placeholder="Rechercher une techno…"
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
          />
        </div>

        {open && (
          <CommandList className="bg-ios-card border-ios-separator mt-2 rounded-xl border shadow-sm">
            <CommandEmpty>Aucune techno</CommandEmpty>
            <CommandGroup>
              {matches.map((stack) => (
                <CommandItem
                  key={stack.id}
                  value={stack.id}
                  onSelect={() => add(stack.id)}
                  className={cn("cursor-pointer rounded-lg")}
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-4"
                    // Admin-authored SVG icon (single-owner back-office).
                    dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
                  />
                  {stack.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </CommandPrimitive>

      {selected.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={selectedIds} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-2">
              {selected.map((stack) => (
                <SortableBadge key={stack.id} stack={stack} onRemove={remove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
