import { ContentPageView } from "@/features/content-page/content-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentPageView
      slug="privacy"
      subtitle="confidentialité"
      fallbackTitle="Politique de confidentialité"
    />
  );
}
