import { HomeContent } from "@/features/home/home-content";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: SiteConfig.title },
  description: SiteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeContent />;
}
