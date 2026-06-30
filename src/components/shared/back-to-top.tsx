"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icons";
import { useCallback, useEffect, useState } from "react";

/**
 * Bouton flottant « remonter en haut » (façon portfolio Hygraph) : apparaît
 * après ~300px de scroll, remonte en douceur. Style = bouton primary (glow).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  const toggle = useCallback(() => {
    setVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, [toggle]);

  if (!visible) return null;

  return (
    <Button
      type="button"
      size="icon"
      aria-label="Remonter en haut de la page"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
      className="animate-in fade-in slide-in-from-bottom-2 fixed right-6 bottom-6 z-[200] rounded-lg"
    >
      <Icon name="arrow-up" size="size-5" />
    </Button>
  );
}
