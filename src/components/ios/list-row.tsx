import type { ElementType } from "react";
import type * as React from "react";

import { Icon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

type ListRowOwnProps = {
  /** Render element: `"div"` (static), `"button"`, or a component like `Link`. */
  as?: ElementType;
  /** Destination when rendered as a link (`as={Link}`). */
  href?: string;
  /** Leading visual (typically an `IconTile`). */
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned content (value, actions, control). */
  trailing?: React.ReactNode;
  /** Show a trailing chevron (navigable rows). */
  showChevron?: boolean;
  className?: string;
};

type ListRowProps = ListRowOwnProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof ListRowOwnProps>;

/**
 * iOS "Settings" list row: optional leading IconTile, title (+ subtitle) on the
 * left, trailing value/actions/chevron on the right. Min 44px tall.
 * Pass `as={Link}` / `as="button"` for interactive rows (adds focus-visible ring).
 */
export function ListRow({
  as,
  leading,
  title,
  subtitle,
  trailing,
  showChevron,
  className,
  ...props
}: ListRowProps) {
  const Comp = (as ?? "div") as ElementType;
  const interactive = Comp !== "div";

  return (
    <Comp
      data-slot="list-row"
      className={cn(
        "relative flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left",
        interactive &&
          "hover:bg-ios-separator/30 focus-visible:ring-primary cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset",
        className,
      )}
      {...props}
    >
      {leading}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-ios-label truncate text-[15px]">{title}</span>
        {subtitle ? (
          <span className="text-ios-secondary-label truncate text-[13px]">
            {subtitle}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span className="text-ios-secondary-label flex shrink-0 items-center gap-2">
          {trailing}
        </span>
      ) : null}
      {showChevron ? (
        <Icon
          name="chevron-right"
          className="text-ios-tertiary-label size-4 shrink-0"
          aria-hidden
        />
      ) : null}
    </Comp>
  );
}
