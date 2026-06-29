import { SectionTitle } from "@/components/shared/section-title";
import { ContactForm } from "@/features/contact/portfolio/contact-form";
import { SectionLayout } from "@/features/landing/section-layout";
import { getOrgProfile } from "@/query/portfolio/get-about";
import { SiteConfig } from "@/site-config";
import Link from "next/link";
import { SocialLinks } from "./social-links";

/** Public portfolio footer — holds the public contact form (id="contact"). */
export async function Footer() {
  const org = await getOrgProfile();

  return (
    <footer id="contact" className="border-t">
      <SectionLayout variant="default" size="base">
        <SectionTitle
          subtitle="contact"
          title="Prenez contact avec moi"
          className="items-center text-center"
        />
        <div className="mx-auto mt-10 w-full max-w-[480px]">
          <ContactForm />
        </div>
        <SocialLinks socials={org?.socials} className="mt-10 justify-center" />
      </SectionLayout>

      <div className="bg-card text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t px-4 py-5 text-center font-mono text-sm">
        <span>
          © {org?.name ?? SiteConfig.company.name}. Tous droits réservés.
        </span>
        <Link href="/legal" className="hover:text-primary transition-colors">
          Légal
        </Link>
        <Link
          href="/changelog"
          className="hover:text-primary transition-colors"
        >
          Changelog
        </Link>
      </div>
    </footer>
  );
}
