import { cn } from "@/lib/utils";
import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * Lien texte stylé (façon portfolio Hygraph) : `muted` → `accent` au survol,
 * avec focus ring. Hérite de la taille de son contexte (pas de taille fixe).
 * Pour un lien-bouton, utiliser `<Button href=…>` à la place.
 */
export function Link({
  className,
  children,
  ...props
}: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={cn(
        "text-muted-foreground hover:text-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
