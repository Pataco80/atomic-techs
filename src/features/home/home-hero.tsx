import { RichTextRenderer } from "@/components/nowts/rich-text-renderer";
import { buttonVariants } from "@/components/ui/button";
import type { PersonProfileRecord } from "@/query/portfolio/get-about";
import { SiteConfig } from "@/site-config";
import type { JSONContent } from "@tiptap/react";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeHero({ person }: { person: PersonProfileRecord | null }) {
  const name = person?.fullName ?? SiteConfig.title;

  return (
    <section className="dark bg-pale-sky-950 bg-hero-portfolio text-foreground relative overflow-hidden bg-cover bg-right-bottom [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] lg:min-h-[88vh] lg:bg-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 50% 28%, rgba(0,85,255,0.30) 0%, transparent 55%), linear-gradient(to bottom, rgba(0,5,16,0.65) 0%, rgba(0,13,42,0.30) 40%, rgba(0,19,64,0.90) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-4 pt-28 pb-20 lg:min-h-[88vh] lg:flex-row lg:justify-between lg:gap-16 lg:pb-28">
        <div className="w-full lg:max-w-[560px]">
          <p className="text-blue-ribbon-300 mb-3 text-sm sm:text-base">
            Bonjour, je m'appelle
          </p>
          <h1 className="text-pale-sky-50 font-mono text-3xl font-medium sm:text-4xl">
            {name}
          </h1>
          {person?.headline ? (
            <p className="text-blue-ribbon-200 mt-2 font-mono text-base sm:text-lg">
              {person.headline}
            </p>
          ) : null}
          {person?.bioHome ? (
            <div className="text-pale-sky-300 my-8">
              <RichTextRenderer content={person.bioHome as JSONContent} />
            </div>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/#contact" className={buttonVariants({ size: "lg" })}>
              Contactez-moi
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/portfolio"
              className="text-pale-sky-200 hover:text-blue-ribbon-300 rounded-sm font-medium transition-colors"
            >
              Voir le portfolio
            </Link>
          </div>
        </div>

        {person?.avatarUrl ? (
          <Image
            src={person.avatarUrl}
            alt={name}
            width={420}
            height={420}
            priority
            className="shadow-glow size-52 shrink-0 rounded-full object-cover sm:size-64 lg:size-80"
          />
        ) : (
          <div className="bg-pale-sky-800/60 text-pale-sky-500 ring-pale-sky-700 shadow-glow grid size-52 shrink-0 place-items-center rounded-full ring-1 sm:size-64 lg:size-80">
            <User className="size-20" />
          </div>
        )}
      </div>
    </section>
  );
}
