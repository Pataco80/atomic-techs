import { SectionTitle } from "@/components/shared/section-title";
import { SectionLayout } from "@/features/landing/section-layout";
import { computeSeniority } from "@/lib/format/seniority";
import type { StackItemRecord } from "@/query/portfolio/get-stacks";

export function KnowTechs({ stacks }: { stacks: StackItemRecord[] }) {
  if (stacks.length === 0) return null;

  return (
    <SectionLayout
      variant="alt-section"
      glow
      aria-label="Technologies maîtrisées"
    >
      <SectionTitle subtitle="compétences" title="Technologies maîtrisées" />
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
        {stacks.map((stack) => (
          <div
            key={stack.id}
            className="bg-foreground/[0.05] hover:bg-foreground/[0.1] hover:text-primary flex flex-col gap-2 rounded-lg p-6 transition-all hover:scale-[1.03] hover:shadow-[0_0_15px_-2px_rgba(0,85,255,0.45)]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-medium">{stack.name}</p>
              <div
                className="[&>svg]:size-6"
                // Admin-authored SVG icon (single-owner back-office).
                dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
              />
            </div>
            <span className="text-muted-foreground text-sm">
              {computeSeniority(stack.validatedAt)} d'expérience
            </span>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
