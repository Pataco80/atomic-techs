import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import {
  getCareerEvents,
  getContentPages,
  getOrgProfile,
  getPersonProfile,
} from "@/query/portfolio/get-about";
import { Suspense } from "react";
import { CareerSection } from "./_components/career-section";
import { ContentPagesSection } from "./_components/content-pages-section";
import { OrgForm } from "./_components/org-form";
import { PersonForm } from "./_components/person-form";

export default function AboutPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>À Propos</LayoutTitle>
        <LayoutDescription>
          Profil, organisation, parcours et pages de contenu.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <Suspense fallback={<AboutSkeleton />}>
          <AboutSection />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}

async function AboutSection() {
  const [person, org, events, pages] = await Promise.all([
    getPersonProfile(),
    getOrgProfile(),
    getCareerEvents(),
    getContentPages(),
  ]);

  return (
    <Accordion type="multiple" defaultValue={["person"]} className="w-full">
      <AccordionItem value="person">
        <AccordionTrigger>Profil personnel</AccordionTrigger>
        <AccordionContent>
          <PersonForm person={person} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="org">
        <AccordionTrigger>Organisation</AccordionTrigger>
        <AccordionContent>
          <OrgForm org={org} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="career">
        <AccordionTrigger>Parcours</AccordionTrigger>
        <AccordionContent>
          <CareerSection events={events} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="pages">
        <AccordionTrigger>Pages de contenu</AccordionTrigger>
        <AccordionContent>
          <ContentPagesSection pages={pages} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function AboutSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {["a", "b", "c", "d"].map((key) => (
        <Skeleton key={key} className="h-12 w-full" />
      ))}
    </div>
  );
}
