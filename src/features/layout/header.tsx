import { NavLink } from "@/features/layout/nav-link";
import { HeaderBase } from "./header-base";

export function Header() {
  return (
    <HeaderBase>
      <NavLink href="/">Accueil</NavLink>
      <NavLink href="/portfolio">Portfolio</NavLink>
    </HeaderBase>
  );
}
