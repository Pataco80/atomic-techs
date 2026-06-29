import { Button } from "@/components/nowts/button";
import { RichTextRenderer } from "@/components/nowts/rich-text-renderer";
import { Typography } from "@/components/nowts/typography";
import { SocialLinks } from "@/features/layout/social-links";
import { TechBadge } from "@/features/knowtecks/tech-badge";
import type {
  OrgProfileRecord,
  PersonProfileRecord,
} from "@/query/portfolio/get-about";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { SiteConfig } from "@/site-config";
import type { JSONContent } from "@tiptap/react";
import { ArrowRight, User } from "lucide-react";
import Image from "next/image";

export function HomeHero({
  person,
  stacks,
  org,
}: {
  person: PersonProfileRecord | null;
  stacks: StackItemRecord[];
  org: OrgProfileRecord | null;
}) {
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
          <Typography variant="small" className="text-blue-ribbon-300 mb-3">
            Bonjour, je m'appelle
          </Typography>
          <Typography
            as="h1"
            variant="h4"
            className="text-pale-sky-50 font-mono font-medium"
          >
            {name}
          </Typography>
          {person?.headline ? (
            <Typography
              variant="default"
              className="text-blue-ribbon-200 mt-2 font-mono"
            >
              {person.headline}
            </Typography>
          ) : null}
          {person?.bioHome ? (
            <div className="text-pale-sky-300 my-8">
              <RichTextRenderer content={person.bioHome as JSONContent} />
            </div>
          ) : null}
          {stacks.length > 0 ? (
            <ul className="mt-6 flex max-w-[440px] list-none flex-wrap gap-2">
              {stacks.slice(0, 8).map((stack) => (
                <li key={stack.id}>
                  <TechBadge name={stack.name} />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/#contact" size="lg">
              Contactez-moi
              <ArrowRight className="size-4" />
            </Button>
            <SocialLinks socials={org?.socials ?? null} />
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
