import { SectionTitle } from "@/components/shared/section-title";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PageIntroProps = {
  subtitle: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  /** Optional content (badges, CTA buttons…) rendered under the intro. */
  children?: ReactNode;
};

/**
 * Full-height intro hero for top-level public pages (e.g. /portfolio).
 * Mirrors the Hygraph `PageIntroduction`: hero background image + blue glow,
 * centred title/subtitle, an intro paragraph and a back link.
 */
export function PageIntro({
  subtitle,
  title,
  description,
  backHref,
  backLabel = "Retour à la page d'accueil",
  children,
}: PageIntroProps) {
  return (
    <section className="dark bg-pale-sky-950 bg-hero-portfolio text-foreground relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-cover bg-right-bottom px-4 py-20 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] lg:bg-center lg:pt-16 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(800px circle at 50% 35%, rgba(0,85,255,0.28) 0%, transparent 58%), linear-gradient(to bottom, rgba(0,5,16,0.55) 0%, rgba(0,13,42,0.25) 45%, rgba(0,19,64,0.85) 100%)",
        }}
      />
      <SectionTitle
        as="h1"
        subtitle={subtitle}
        title={title}
        className="relative z-10 items-center text-center [&>:last-child]:text-4xl sm:[&>:last-child]:text-5xl"
      />
      <div className="relative z-10 mt-4 flex max-w-[650px] flex-col items-center">
        {description ? (
          <p className="text-pale-sky-400 my-6 text-center text-sm sm:my-10 sm:text-base">
            {description}
          </p>
        ) : null}
        {children}
        {backHref ? (
          <Link
            href={backHref}
            className="text-pale-sky-200 hover:text-blue-ribbon-300 inline-flex items-center gap-2 rounded-sm font-medium transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowLeft className="size-5" />
            {backLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
