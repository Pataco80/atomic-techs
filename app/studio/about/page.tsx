import { RichTextDemo } from "@/components/nowts/rich-text-demo";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";

export default function AboutPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>À Propos</LayoutTitle>
        <LayoutDescription>
          Profil, parcours et coordonnées — le CRUD arrive en spec 02.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-3">
        <RichTextDemo />
      </LayoutContent>
    </Layout>
  );
}
