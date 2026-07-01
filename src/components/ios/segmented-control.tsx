"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

type Segment = {
  value: string;
  label: React.ReactNode;
};

type SegmentedControlProps = {
  value: string;
  onValueChange: (value: string) => void;
  segments: Segment[];
  className?: string;
  "aria-label"?: string;
};

/**
 * iOS segmented control: a rounded pill track where the selected segment lifts
 * onto a card surface. Controlled via `value` / `onValueChange`.
 */
export function SegmentedControl({
  value,
  onValueChange,
  segments,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "bg-ios-separator/40 inline-flex items-center gap-1 rounded-full p-1",
        className,
      )}
    >
      {segments.map((segment) => {
        const isSelected = segment.value === value;
        return (
          <button
            key={segment.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onValueChange(segment.value)}
            className={cn(
              "focus-visible:ring-primary cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2",
              isSelected
                ? "bg-ios-card text-ios-label shadow-sm"
                : "text-ios-secondary-label hover:text-ios-label",
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
