import type * as React from "react";

import { cn } from "@/lib/utils";

import { SectionFooter, SectionHeader } from "./section-header";

type GroupedListProps = {
  /** Optional uppercase section header. */
  header?: React.ReactNode;
  /** Optional footer / help text below the card. */
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/**
 * iOS grouped-list section: optional header, a soft rounded card holding rows
 * separated by inset hairlines, and an optional footer.
 *
 * Inset separators are drawn between direct children, so children should be
 * `ListRow`s (lists) or `field.Field` rows (forms).
 */
export function GroupedList({
  header,
  footer,
  className,
  children,
}: GroupedListProps) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      {header ? <SectionHeader>{header}</SectionHeader> : null}
      <div
        data-slot="grouped-list"
        className={cn(
          "bg-ios-card overflow-hidden rounded-xl shadow-sm",
          "[&>*:not(:last-child)]:relative",
          "[&>*:not(:last-child)]:after:border-ios-separator [&>*:not(:last-child)]:after:pointer-events-none [&>*:not(:last-child)]:after:absolute [&>*:not(:last-child)]:after:inset-x-4 [&>*:not(:last-child)]:after:bottom-0 [&>*:not(:last-child)]:after:border-b",
        )}
      >
        {children}
      </div>
      {footer ? <SectionFooter>{footer}</SectionFooter> : null}
    </section>
  );
}
