import { Button } from "@/components/nowts/button";
import { Typography } from "@/components/nowts/typography";
import type { PropsWithChildren } from "react";

type Page400Props = PropsWithChildren<{
  title?: string;
}>;

export function Page400(props: Page400Props) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="max-w-lg space-y-3">
        <Typography variant="code">Erreur</Typography>
        <Typography variant="h2">
          {props.title ?? "Une erreur est survenue"}
        </Typography>
        {props.children ?? (
          <Typography variant="muted">
            Un problème technique est survenu de notre côté. Réessayez dans un
            instant ou revenez un peu plus tard.
          </Typography>
        )}
      </div>
      <Button href="/" size="lg">
        Retour à l'accueil
      </Button>
    </div>
  );
}
