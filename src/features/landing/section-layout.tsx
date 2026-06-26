import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SectionLayoutProps = {
  /**
   * The section size.
   * sm = 896px
   * base = 1024px
   * lg = 1152px
   */
  size?: "sm" | "base" | "lg";
  /**
   * The variant of the section.
   * default = default background and foreground
   * alt-section = alternating muted background (vertical section rhythm)
   * card = card background and card foreground
   * primary = primary background and primary foreground
   * invert = foreground background and background foreground
   * image = background image with foreground text. The background image will be blured.
   */
  variant?:
    | "default"
    | "alt-section"
    | "card"
    | "primary"
    | "invert"
    | "image"
    | "transparent";
  /**
   * Render a soft radial "circuit" glow behind the content.
   */
  glow?: boolean;
  /**
   * The class name of the div that contain colors.
   */
  containerClassName?: string;
} & ComponentPropsWithoutRef<"div">;

export const SectionLayout = ({
  size = "base",
  variant = "default",
  glow = false,
  className,
  containerClassName,
  children,
  ...props
}: SectionLayoutProps) => {
  return (
    <div
      className={cn(
        {
          "bg-background text-foreground": variant === "default",
          "bg-alt-section text-foreground": variant === "alt-section",
          "bg-card text-card-foreground": variant === "card",
          "bg-primary text-primary-foreground": variant === "primary",
          "bg-foreground text-background": variant === "invert",
          "text-foreground backdrop-blur-sm backdrop-brightness-75":
            variant === "image",
          "text-foreground bg-transparent": variant === "transparent",
        },
        glow && "relative overflow-hidden",
        containerClassName,
      )}
      {...props}
    >
      {glow ? (
        <div
          aria-hidden
          className="bg-section-glow pointer-events-none absolute inset-0 opacity-60"
        />
      ) : null}
      <div
        className={cn(
          "m-auto px-4 py-20 lg:py-28",
          {
            "max-w-4xl": size === "sm",
            "max-w-5xl": size === "base",
            "max-w-6xl": size === "lg",
          },
          glow && "relative z-10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};
