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
import { AboutTabs } from "./_components/about-tabs";
import { CareerSection } from "./_components/career-section";
import { ContentPagesSection } from "./_components/content-pages-section";
import { OrgForm } from "./_components/org-form";
import { PersonForm } from "./_components/person-form";

export default function AboutPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="text-3xl font-bold tracking-tight">
          À Propos
        </LayoutTitle>
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
    <AboutTabs
      person={<PersonForm person={person} />}
      org={<OrgForm org={org} />}
      career={<CareerSection events={events} />}
      pages={<ContentPagesSection pages={pages} />}
    />
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
