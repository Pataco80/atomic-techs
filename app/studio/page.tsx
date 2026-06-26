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
        <LayoutTitle>Dashboard</LayoutTitle>
      </LayoutHeader>
      <LayoutActions></LayoutActions>
      <LayoutContent className="flex flex-col gap-4 lg:gap-8">
        <InformationCards />
        <SubscribersChart />
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Messages de contact
          </h2>
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
