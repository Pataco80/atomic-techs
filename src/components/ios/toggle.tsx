"use client";

import type * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

/**
 * iOS-style toggle: a reskin of the Radix Switch primitive (wider rounded track,
 * green/tint when on, large white thumb). Same props as Radix Switch so it binds
 * directly to TanStack Form field state via `checked` / `onCheckedChange`.
 */
export function Toggle({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="ios-toggle"
      className={cn(
        "peer data-[state=unchecked]:bg-ios-separator data-[state=checked]:bg-success focus-visible:ring-primary inline-flex h-[31px] w-[51px] shrink-0 items-center rounded-full border-2 border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="ios-toggle-thumb"
        className={cn(
          "pointer-events-none block size-[27px] rounded-full bg-white shadow ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
