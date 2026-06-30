import { Typography } from "@/components/nowts/typography";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { getContacts } from "@/query/portfolio/get-contacts";
import { Suspense } from "react";
import { ContactsList } from "./_components/contacts-list";
import InformationCards from "./_components/information-cards";
import { SubscribersChart } from "./_components/subscribers-charts";

export default async function RoutePage() {
  await getRequiredUser();
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="text-3xl font-bold tracking-tight">
          Dashboard
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions></LayoutActions>
      <LayoutContent className="flex flex-col gap-4 lg:gap-8">
        <InformationCards />
        <SubscribersChart />
        <section className="flex flex-col gap-4">
          <Typography
            variant="large"
            as="h2"
            className="font-semibold tracking-tight"
          >
            Messages de contact
          </Typography>
          <Suspense
            fallback={
              <div className="bg-muted h-24 w-full animate-pulse rounded" />
            }
          >
            <ContactsSection />
          </Suspense>
        </section>
      </LayoutContent>
    </Layout>
  );
}

async function ContactsSection() {
  const contacts = await getContacts();
  return <ContactsList contacts={contacts} />;
}
