import { BackToTop } from "@/components/shared/back-to-top";
import { Footer } from "@/features/layout/footer";
import { Header } from "@/features/layout/header";
import { SkipLink } from "@/features/layout/skip-link";
import type { PropsWithChildren } from "react";

export function BaseLayout(props: PropsWithChildren) {
  return (
    <div className="relative flex min-h-full flex-col">
      <SkipLink />
      <Header />
      <main
        id="contenu"
        tabIndex={-1}
        className="min-h-full flex-1 focus:outline-none"
      >
        {props.children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
