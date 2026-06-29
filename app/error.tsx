"use client";

import { Button } from "@/components/nowts/button";
import { ContactSupportDialog } from "@/features/contact/support/contact-support-dialog";
import { ErrorHero } from "@/features/page/error-hero";

export default function ErrorPage() {
  return (
    <ErrorHero
      code="Erreur"
      title="Une erreur est survenue"
      description="Un problème technique est survenu de notre côté. Réessayez dans un instant ou revenez un peu plus tard."
      actions={
        <>
          <Button href="/" size="lg">
            Retour à l'accueil
          </Button>
          <ContactSupportDialog />
        </>
      }
    />
  );
}
