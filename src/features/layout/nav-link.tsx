"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * Lien de navigation : pose `aria-current="page"` sur la route active (a11y),
 * avec un rappel visuel discret. « / » n'est actif que sur l'accueil exact ;
 * les autres routes couvrent leurs sous-pages (ex. /portfolio/[slug]).
 */
export function NavLink({
  href,
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const path = typeof href === "string" ? href : (href.pathname ?? "");
  const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "aria-[current=page]:bg-foreground/10",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
