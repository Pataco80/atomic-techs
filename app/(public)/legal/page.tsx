import { ContentPageView } from "@/features/content-page/content-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <ContentPageView
      slug="legal"
      subtitle="légal"
      fallbackTitle="Mentions légales"
    />
  );
}
