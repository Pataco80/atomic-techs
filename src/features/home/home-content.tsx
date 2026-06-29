import { CircuitDivider } from "@/components/shared/circuit-divider";
import { KnowTechs } from "@/features/knowtecks/know-techs";
import { JsonLd } from "@/features/seo/json-ld";
import { WorkExperience } from "@/features/work-experiences/work-experience";
import { buildPersonJsonLd } from "@/lib/seo/json-ld";
import {
  getCareerEvents,
  getOrgProfile,
  getPersonProfile,
} from "@/query/portfolio/get-about";
import { getProjects } from "@/query/portfolio/get-projects";
import { getStacks } from "@/query/portfolio/get-stacks";
import { SiteConfig } from "@/site-config";
import { Fragment, type ReactNode } from "react";
import { FeaturedProjects } from "./featured-projects";
import { HomeHero } from "./home-hero";

// Background tone of each section, used to pick the right divider transition.
type Tone = "hero" | "alt" | "default";
type DividerVariant = "hero" | "hero-alt" | "reverse" | "base";

function dividerBetween(from: Tone, to: Tone): DividerVariant | null {
  if (from === to) return null;
  if (from === "hero") return to === "alt" ? "hero-alt" : "hero";
  if (from === "alt" && to === "default") return "reverse";
  if (from === "default" && to === "alt") return "base";
  return null;
}

export async function HomeContent() {
  const [person, org, stacks, projects, events] = await Promise.all([
    getPersonProfile(),
    getOrgProfile(),
    getStacks(),
    getProjects(),
    getCareerEvents(),
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 4);

  // Only the sections with content; CircuitDividers are inserted between them
  // with the variant matching the two real adjacent backgrounds.
  const blocks: { key: string; tone: Tone; node: ReactNode }[] = [
    {
      key: "hero",
      tone: "hero",
      node: <HomeHero person={person} stacks={stacks} org={org} />,
    },
  ];
  if (stacks.length > 0) {
    blocks.push({
      key: "knowtechs",
      tone: "alt",
      node: <KnowTechs stacks={stacks} />,
    });
  }
  if (featured.length > 0) {
    blocks.push({
      key: "featured",
      tone: "default",
      node: <FeaturedProjects projects={featured} />,
    });
  }
  if (events.length > 0) {
    blocks.push({
      key: "experience",
      tone: "alt",
      node: <WorkExperience events={events} person={person} org={org} />,
    });
  }

  return (
    <>
      <JsonLd data={buildPersonJsonLd(person, SiteConfig.prodUrl)} />
      {blocks.map((block, index) => {
        const variant =
          index > 0 ? dividerBetween(blocks[index - 1].tone, block.tone) : null;
        return (
          <Fragment key={block.key}>
            {variant ? <CircuitDivider variant={variant} /> : null}
            {block.node}
          </Fragment>
        );
      })}
    </>
  );
}
