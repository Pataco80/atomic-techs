import { SectionTitle } from "@/components/shared/section-title";
import { SectionLayout } from "@/features/landing/section-layout";
import { computeSeniority } from "@/lib/format/seniority";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";
import { Typography } from "@/components/nowts/typography";
import { Card } from "@/components/ui/card";

export function KnowTechs({ stacks }: { stacks: StackItemRecord[] }) {
  if (stacks.length === 0) return null;

  return (
    <SectionLayout
      variant="alt-section"
      glow
      aria-label="Technologies maîtrisées"
    >
      <SectionTitle
        subtitle="compétences"
        title="Technologies maîtrisées"
        titleVariant="h3"
      />
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
        {stacks.map((stack) => (
          <Card
            key={stack.id}
            className="border-transparent bg-foreground/[0.07] hover:bg-foreground/[0.12] hover:text-accent flex flex-col gap-2 rounded-lg p-6 shadow-none transition-all hover:scale-105 hover:shadow-glow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <Typography variant="default" className="font-medium">
                {stack.name}
              </Typography>
              <div
                className="[&>svg]:size-6"
                // Admin-authored SVG icon (single-owner back-office).
                dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
              />
            </div>
            <Typography variant="tiny" className="text-muted-foreground">
              {computeSeniority(stack.validatedAt)} d'expérience
            </Typography>
          </Card>
        ))}
      </div>
    </SectionLayout>
  );
}
