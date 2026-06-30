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
  Home,
  BarChart3,
  UserRound,
  FolderGit2,
  Layers,
  Users,
  Shield,
  MessageSquare,
  ChevronRight,
  Mail,
  LayoutDashboard,
  Settings,
  SunMoon,
  SunMedium,
  Monitor,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  Loader2,
  Ban,
  Crown,
  Eye,
  UserCheck,
  MoreHorizontal,
  Angry,
  Frown,
  Meh,
  SmilePlus,
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
  // Back-office iOS (app/studio/*)
  home: Home,
  analytics: BarChart3,
  "user-round": UserRound,
  "folder-git": FolderGit2,
  layers: Layers,
  users: Users,
  shield: Shield,
  message: MessageSquare,
  "chevron-right": ChevronRight,
  mail: Mail,
  // User dropdown menu (src/features/auth/user-dropdown.tsx)
  dashboard: LayoutDashboard,
  settings: Settings,
  "sun-moon": SunMoon,
  "sun-medium": SunMedium,
  monitor: Monitor,
  // Admin back-office (app/admin/*)
  search: Search,
  smartphone: Smartphone,
  tablet: Tablet,
  trash: Trash2,
  loader: Loader2,
  ban: Ban,
  crown: Crown,
  eye: Eye,
  "user-check": UserCheck,
  "more-horizontal": MoreHorizontal,
  angry: Angry,
  frown: Frown,
  meh: Meh,
  "smile-plus": SmilePlus,
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
