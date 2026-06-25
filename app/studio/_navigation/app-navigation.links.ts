import type { NavigationGroup } from "@/features/navigation/navigation.type";
import {
  FolderGit2,
  Home,
  Layers,
  MessageSquare,
  Shield,
  User,
  UserRound,
  Users,
} from "lucide-react";

const APP_PATH = "/studio";
const ADMIN_PATH = "/admin";

export const APP_LINKS: NavigationGroup[] = [
  {
    title: "Menu",
    links: [
      {
        href: APP_PATH,
        Icon: Home,
        label: "Dashboard",
      },
      {
        href: `${APP_PATH}/users`,
        Icon: User,
        label: "Analytics",
      },
      {
        href: `${APP_PATH}/about`,
        Icon: UserRound,
        label: "À-propos",
      },
    ],
  },
  {
    title: "Portfolio",
    links: [
      {
        href: `${APP_PATH}/projects`,
        Icon: FolderGit2,
        label: "Projets",
      },
      {
        href: `${APP_PATH}/stacks`,
        Icon: Layers,
        label: "Stacks",
      },
    ],
  },
  {
    // Mono-tenant: the single owner is also the super-admin. The /admin section keeps
    // its own shell; we surface its entry points here so the owner starts from one place.
    title: "Administration",
    links: [
      {
        href: ADMIN_PATH,
        Icon: Shield,
        label: "Admin",
      },
      {
        href: `${ADMIN_PATH}/users`,
        Icon: Users,
        label: "Users",
      },
      {
        href: `${ADMIN_PATH}/feedback`,
        Icon: MessageSquare,
        label: "Feedback",
      },
    ],
  },
] satisfies NavigationGroup[];
