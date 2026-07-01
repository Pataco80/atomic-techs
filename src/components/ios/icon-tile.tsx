import type * as React from "react";

import type { IconKey } from "@/components/shared/icons";
import { Icon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

type IconTileProps = {
  name: IconKey;
  /** Tint background utility, e.g. `bg-primary`, `bg-success`. Defaults to the iOS tint (primary). */
  className?: string;
} & Omit<React.ComponentProps<"span">, "children">;

/**
 * iOS "Settings" icon container: a small rounded tinted square holding a white glyph.
 * The glyph is rendered by the shared `Icon` component (no direct lucide import here).
 */
export function IconTile({ name, className, ...props }: IconTileProps) {
  return (
    <span
      data-slot="icon-tile"
      className={cn(
        "bg-primary flex size-7 shrink-0 items-center justify-center rounded-md text-white",
        className,
      )}
      {...props}
    >
      <Icon name={name} className="size-4" aria-hidden />
    </span>
  );
}
