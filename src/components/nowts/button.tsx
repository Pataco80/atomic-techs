import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Button polymorphe (façon portfolio Hygraph), bâti sur les variants Shadcn :
 * - sans `href`            → <button>
 * - `href` interne         → next/link
 * - `href` + `external`    → <a target="_blank" rel="noopener noreferrer">
 *
 * Le style (couleur, glow, rounded-lg) vient de `buttonVariants` — on garde
 * donc tous les variants (default, outline, ghost…) et les tailles.
 *
 * ```tsx
 * <Button href="/#contact" size="lg">Contactez-moi</Button>
 * <Button href={liveUrl} external variant="outline">Voir en ligne</Button>
 * <Button onClick={…}>Action</Button>
 * ```
 */
type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  className?: string;
  /** Rendu en lien si fourni (next/link interne, <a> si `external`). */
  href?: string;
  /** href externe : nouvel onglet + rel sécurisé. */
  external?: boolean;
};

type ButtonProps = ButtonOwnProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement> &
      AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonOwnProps
  >;

export function Button({
  children,
  className,
  href,
  external,
  variant,
  size,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <NextLink
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
