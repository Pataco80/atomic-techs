import { Button } from "@/components/nowts/button";
import { ErrorHero } from "@/features/page/error-hero";

export default function NotFoundPage() {
  return (
    <ErrorHero
      code="404"
      title="Page introuvable"
      description="Désolé, la page que vous cherchez n'existe pas ou a été déplacée."
      actions={
        <Button href="/" size="lg">
          Retour à l'accueil
        </Button>
      }
    />
  );
}
