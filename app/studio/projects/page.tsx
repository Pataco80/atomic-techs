import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";

export default function ProjectsPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Projets</LayoutTitle>
        <LayoutDescription>
          Gestion des projets du portfolio — le CRUD arrive en spec 02.
        </LayoutDescription>
      </LayoutHeader>
    </Layout>
  );
}
