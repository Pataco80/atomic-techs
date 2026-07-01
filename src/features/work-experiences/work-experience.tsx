import { RichTextRenderer } from "@/components/nowts/rich-text-renderer";
import { Typography } from "@/components/nowts/typography";
import { SectionTitle } from "@/components/shared/section-title";
import { SectionLayout } from "@/features/landing/section-layout";
import { Badge } from "@/components/ui/badge";
import { TechBadge } from "@/features/knowtecks/tech-badge";
import { SocialLinks } from "@/features/layout/social-links";
import { sortCareerEventsChrono } from "@/lib/format/career-order";
import type {
  CareerEventRecord,
  OrgProfileRecord,
  PersonProfileRecord,
} from "@/query/portfolio/get-about";
import type { JSONContent } from "@tiptap/react";
import Image from "next/image";

const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function monthYear(month: number, year: number): string {
  return `${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

function period(event: CareerEventRecord): string {
  const start = monthYear(event.startMonth, event.startYear);
  const end =
    event.endYear == null
      ? "Aujourd'hui"
      : monthYear(event.endMonth ?? 1, event.endYear);
  return `${start} – ${end}`;
}

function ExperienceItem({ event }: { event: CareerEventRecord }) {
  return (
    <article className="grid grid-cols-[44px_1fr] gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="border-primary/60 bg-primary/10 grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 shadow-[0_0_12px_rgba(0,85,255,0.25)]">
          {event.companyLogo ? (
            <Image
              src={event.companyLogo}
              alt={event.companyName}
              width={44}
              height={44}
              className="size-full object-cover"
            />
          ) : (
            <Typography variant="small" className="text-primary font-semibold">
              {event.companyName.slice(0, 1).toUpperCase()}
            </Typography>
          )}
        </div>
        <div className="from-primary/50 to-border h-full w-0.5 bg-gradient-to-b" />
      </div>

      <div className="flex flex-col gap-2 pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Typography variant="large" as="h3">
            {event.jobTitle}
          </Typography>
          {event.endYear == null ? <Badge>Poste actuel</Badge> : null}
        </div>
        <Typography variant="small">
          <span className="text-primary">@</span> {event.companyName}
        </Typography>
        <Typography variant="tiny" className="text-muted-foreground font-mono">
          {period(event)}
        </Typography>
        {event.description ? (
          <div className="text-muted-foreground mt-1">
            <RichTextRenderer content={event.description as JSONContent} />
          </div>
        ) : null}
        {event.stacks.length > 0 ? (
          <div className="mt-2 flex flex-col gap-2">
            <Typography
              variant="tiny"
              className="text-muted-foreground font-mono tracking-wide uppercase"
            >
              Stacks et logiciels
            </Typography>
            <div className="flex flex-wrap gap-2">
              {event.stacks.map((eventStack) => (
                <TechBadge
                  key={eventStack.stackItem.id}
                  name={eventStack.stackItem.name}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function WorkExperience({
  events,
  person,
  org,
}: {
  events: CareerEventRecord[];
  person: PersonProfileRecord | null;
  org: OrgProfileRecord | null;
}) {
  if (events.length === 0) return null;
  const sorted = sortCareerEventsChrono(events);

  return (
    <SectionLayout
      variant="alt-section"
      glow
      aria-label="Parcours professionnel"
      className="flex flex-col gap-10 md:flex-row md:gap-12"
    >
      <article className="flex flex-col gap-6 md:max-w-[280px] md:shrink-0 lg:max-w-[420px]">
        <SectionTitle
          subtitle="expériences"
          title="Parcours professionnel"
          titleVariant="h3"
        />
        {person?.bioWork ? (
          <div className="text-muted-foreground">
            <RichTextRenderer content={person.bioWork as JSONContent} />
          </div>
        ) : null}
        <SocialLinks socials={org?.socials} />
      </article>

      <div className="flex flex-1 flex-col">
        {sorted.map((event, _index) => (
          <ExperienceItem key={event.id} event={event} />
        ))}
      </div>
    </SectionLayout>
  );
}
