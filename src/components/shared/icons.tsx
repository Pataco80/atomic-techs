import type { LucideIcon, LucideProps } from "lucide-react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Github,
  Globe,
  Sun,
  Moon,
  Heart,
} from "lucide-react";

// Registre des icones utilisees (cle kebab -> composant lucide).
// On n'ajoute ici QUE les icones reellement utilisees dans l'app.
export const ICONS_REGISTRY = {
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  github: Github,
  globe: Globe,
  sun: Sun,
  moon: Moon,
  heart: Heart,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS_REGISTRY;

export const ICON_KEYS = Object.keys(ICONS_REGISTRY) as readonly IconKey[];

type IconProps = LucideProps & {
  name: IconKey;
};

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = ICONS_REGISTRY[name];
  return <IconComponent {...props} />;
}
