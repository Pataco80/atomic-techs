import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared styling for the form-sheet header action buttons — pill-shaped like the
 * sidebar trigger, with the same resting fill (`bg-background` / `dark:bg-input/30`
 * + `shadow-xs`) but borderless, icon tinted on hover. Pair with
 * `variant="ghost" size="icon"`.
 */
const iosSheetButtonBase =
  "bg-background dark:bg-input/30 shadow-xs rounded-full";
/** Cancel (X): resting fill like the sidebar trigger, turns destructive on hover. */
export const iosSheetCancelButton = `${iosSheetButtonBase} hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20`;
/** Validate (✓): resting fill like the sidebar trigger, accent hover, bolder glyph. */
export const iosSheetSubmitButton = `${iosSheetButtonBase} font-semibold [&_svg]:size-5`;

type IosSheetHeaderProps = ComponentPropsWithoutRef<"div"> & {
  /** Centered sheet title, like an iOS form sheet navigation bar. */
  title: string;
  /** Left navigation slot — typically a cancel (X) action. */
  leading?: ReactNode;
  /** Right navigation slot — typically the validate (✓) submit action. */
  trailing?: ReactNode;
};

/**
 * iOS 26 form-sheet navigation bar: a sticky top bar with a cancel action on
 * the left, the title centered, and the validate action on the right — mirroring
 * the Calendar/Reminders "new event" sheets on iPhone. Replaces a bottom submit
 * button inside dialogs.
 */
export const IosSheetHeader = ({
  title,
  leading,
  trailing,
  className,
  ...props
}: IosSheetHeaderProps) => {
  return (
    <div
      {...props}
      data-slot="ios-sheet-header"
      className={cn(
        "bg-ios-grouped/85 border-ios-separator sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b px-2 py-2 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex justify-start">{leading}</div>
      <span className="text-ios-label truncate px-2 text-center text-[17px] font-semibold">
        {title}
      </span>
      <div className="flex justify-end">{trailing}</div>
    </div>
  );
};
