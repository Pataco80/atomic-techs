import { Button } from "@/components/nowts/button";
import { Typography } from "@/components/nowts/typography";

export function Page404() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="space-y-3">
        <Typography variant="code">404</Typography>
        <Typography variant="h2">Page introuvable</Typography>
        <Typography variant="muted" className="max-w-md">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </Typography>
      </div>
      <Button href="/" size="lg">
        Retour à l'accueil
      </Button>
    </div>
  );
}
