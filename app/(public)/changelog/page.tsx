import { ContentPageView } from "@/features/content-page/content-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <ContentPageView
      slug="changelog"
      subtitle="changelog"
      fallbackTitle="Changelog"
    />
  );
}
