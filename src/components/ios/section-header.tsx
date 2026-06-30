import type * as React from "react";

import { cn } from "@/lib/utils";

/** Uppercase group header, iOS "Settings" style (13px, secondary label). */
export function SectionHeader({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-header"
      className={cn(
        "text-ios-secondary-label px-4 text-[13px] font-medium tracking-wide uppercase",
        className,
      )}
      {...props}
    />
  );
}

/** Group footer / help text, iOS "Settings" style (13px, secondary label). */
export function SectionFooter({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-footer"
      className={cn("text-ios-secondary-label px-4 text-[13px]", className)}
      {...props}
    />
  );
}
