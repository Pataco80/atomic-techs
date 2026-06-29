import { Typography } from "@/components/nowts/typography";
import { Header } from "@/features/layout/header";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
type ErrorHeroProps = {
  /** Code court affiché en badge (ex. "404"). */
  code?: string;
  title: string;
  description?: ReactNode;
  /** Bouton(s) d'action. */
  actions?: ReactNode;
};

/**
 * Page d'erreur pleine page façon accueil : image circuit + dégradé bleu sombre,
 * navbar transparente en overlay, et au centre le code, le titre, la description
 * et les boutons. Forcé en `dark` (texte clair sur fond sombre).
 */
export function ErrorHero({
  code,
  title,
  description,
  actions,
}: ErrorHeroProps) {
  return (
    <div className="dark bg-pale-sky-950 bg-hero-portfolio text-foreground relative flex min-h-screen w-full flex-col overflow-hidden bg-cover bg-center [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(800px circle at 50% 35%, rgba(0,85,255,0.28) 0%, transparent 58%), linear-gradient(to bottom, rgba(0,5,16,0.55) 0%, rgba(0,13,42,0.25) 45%, rgba(0,19,64,0.85) 100%)",
        }}
      />
      <Header />
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-20">
        <div className="flex max-w-lg flex-col items-center gap-8 text-center">
          <div className="space-y-10">
            {code ? (
              <Badge className="rounded-lg px-4 py-2 font-semibold text-[length:var(--step-4)]">
                {code}
              </Badge>
            ) : null}
            <Typography variant="h2">{title}</Typography>
            {description ? (
              <Typography variant="muted" className="max-w-md">
                {description}
              </Typography>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
