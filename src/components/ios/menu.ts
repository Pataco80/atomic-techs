// Shared iOS-style dropdown-menu classes (used by the user menu and the
// /admin action menus). Keeps the look consistent without touching the
// Shadcn primitives in `src/components/ui/`.

// iOS menu surface: soft blurred card with rounded pill rows.
export const iosMenuContent =
  "bg-ios-card/95 border-ios-separator rounded-2xl border p-1.5 shadow-xl backdrop-blur-xl";

// Rounded pill row; on hover/highlight (focus) and open sub-menu, the icon
// turns white instead of staying muted-gray.
export const iosMenuItem =
  "rounded-xl focus:[&_svg]:!text-white data-[state=open]:[&_svg]:!text-white";

// Same pill row for destructive actions — keeps the icon/text destructive-red
// on hover (no white override) so the danger affordance is preserved.
export const iosMenuItemDestructive = "rounded-xl";
