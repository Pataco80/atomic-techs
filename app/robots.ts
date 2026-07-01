import { SiteConfig } from "@/site-config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/admin", "/account", "/api"],
    },
    sitemap: `${SiteConfig.prodUrl}/sitemap.xml`,
    host: SiteConfig.prodUrl,
  };
}
