"use client";

import { cn } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

type SortableListProps = {
  /** Ordered list of item ids — the current display order. */
  items: string[];
  /** Called with the full reordered id list after a successful drag. */
  onReorder: (orderedIds: string[]) => void;
  children: ReactNode;
};

/**
 * Vertical drag-and-drop list built on `@dnd-kit`. Wrap rows in
 * {@link SortableItem}; on drop the reordered id list is handed to `onReorder`
 * (typically wired to a `reorder*` server action).
 */
export function SortableList({
  items,
  onReorder,
  children,
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(String(active.id));
    const newIndex = items.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

type SortableRowProps = {
  id: string;
  /**
   * Receives the drag handle so it can be placed *inside* the row (e.g. a
   * `ListRow` `leading` slot) instead of outside it. Render the handle wherever
   * it reads best.
   */
  children: (handle: ReactNode) => ReactNode;
  className?: string;
};

/**
 * Sortable wrapper that hands the drag handle to its render-prop child, so the
 * grip can live *inside* the row chrome (more elegant than a handle bolted onto
 * the left). Must be rendered inside a {@link SortableList}.
 */
export function SortableRow({ id, children, className }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handle = (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
      aria-label="Réordonner"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "relative z-10 opacity-70", className)}
    >
      {children(handle)}
    </div>
  );
}

type SortableItemProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/**
 * A single sortable row. Renders a grab handle on the left followed by
 * `children`. Must be rendered inside a {@link SortableList}.
 */
export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2",
        isDragging && "relative z-10 opacity-70",
        className,
      )}
    >
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        aria-label="Réordonner"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="flex-1">{children}</div>
    </div>
  );
}
