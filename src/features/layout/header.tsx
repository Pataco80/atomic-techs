import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { HeaderBase } from "./header-base";

export function Header() {
  return (
    <HeaderBase>
      <Link
        href="/"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Accueil
      </Link>
      <Link
        href="/portfolio"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Portfolio
      </Link>
      <Link
        href="/#contact"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Contact
      </Link>
    </HeaderBase>
  );
}
