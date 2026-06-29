import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType } from "react";

// Tailles via l'échelle fluide Utopia (`--step-*` dans globals.css) — un seul
// barème partagé pour tout le site. Le STYLE des titres reste sobre (Atomic
// Tech's) : font-caption + graisse + tracking, pas d'uppercase/italic.
export const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "font-caption scroll-m-20 text-[length:var(--step-5)] leading-[1.05] font-extrabold tracking-tight text-balance",
      h2: "font-caption scroll-m-20 text-[length:var(--step-4)] leading-[1.1] font-semibold tracking-tight text-balance transition-colors",
      h3: "font-caption scroll-m-20 text-[length:var(--step-3)] leading-[1.15] font-semibold tracking-tight text-balance",
      h4: "font-caption scroll-m-20 text-[length:var(--step-2)] leading-[1.2] font-semibold tracking-tight text-balance",
      h5: "font-caption scroll-m-20 text-[max(1.5rem,var(--step-1))] leading-[1.25] font-semibold tracking-tight text-balance",
      p: "text-[length:var(--step-0)] leading-7 [&:not(:first-child)]:mt-6",
      default: "text-[length:var(--step-0)] leading-relaxed",
      quote: "mt-6 border-l-2 pl-6 italic",
      code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-[length:var(--step--1)] font-semibold",
      lead: "text-muted-foreground text-[length:var(--step-1)]",
      large: "text-[length:var(--step-1)] font-semibold",
      small: "text-[length:var(--step--1)] font-medium leading-none",
      tiny: "text-[length:var(--step--2)] font-medium leading-none",
      muted: "text-muted-foreground text-[length:var(--step--1)]",
      link: "dark:text-primary font-medium text-cyan-600 hover:underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
type TypographyCvaProps = VariantProps<typeof typographyVariants>;

const defaultElementMapping = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  p: "p",
  quote: "p",
  code: "code",
  lead: "p",
  large: "p",
  small: "p",
  tiny: "p",
  muted: "p",
  link: "a",
  default: "p",
} satisfies Record<NonNullable<TypographyCvaProps["variant"]>, ElementType>;

type TypographyProps<T extends ElementType = "p"> = {
  /** Style visuel (comme `.h3` en Bootstrap). */
  variant?: TypographyCvaProps["variant"];
  /** Balise/élément sémantique (override de la balise par défaut du variant). */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Typography — un seul composant, deux axes INDÉPENDANTS :
 * - `variant` = le STYLE visuel (h1…h5, lead, code, link…) — comme `.h3` en Bootstrap.
 * - `as`      = la BALISE sémantique (override de la balise par défaut du variant).
 *
 * ```tsx
 * import Link from "next/link";
 * <Typography variant="h1" as="h2">Titre de section</Typography>   // <h2> stylé h1
 * <Typography variant="h3" as="h1">Titre d'article sobre</Typography>
 * <Typography variant="link" as={Link} href="/contact">Lien interne</Typography>
 * <Typography variant="link" as="a" href="https://…" target="_blank" rel="noopener noreferrer">Lien externe</Typography>
 * ```
 *
 * Liens texte brandés : `<Link>` de `@/components/nowts/link`.
 * Boutons / liens-boutons : `<Button>` de `@/components/nowts/button`.
 */
export function Typography<T extends ElementType = "p">({
  variant = "default",
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = (as ??
    defaultElementMapping[variant ?? "default"]) as ElementType;
  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}
