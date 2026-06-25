import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";

export default function StacksPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Stacks</LayoutTitle>
        <LayoutDescription>
          Gestion des technologies — le CRUD arrive en spec 02.
        </LayoutDescription>
      </LayoutHeader>
    </Layout>
  );
}
