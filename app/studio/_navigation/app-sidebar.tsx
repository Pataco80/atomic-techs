"use client";

import { GroupedList, IconTile, ListRow } from "@/components/ios";
import type { IconKey } from "@/components/shared/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ContactFeedbackPopover } from "@/features/contact/feedback/contact-feedback-popover";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppCommand } from "./app-command";
import { APP_LINKS } from "./app-navigation.links";
import { UpgradeCard } from "./upgrade-app-card";

const NAV_ICON: Record<string, IconKey> = {
  "/studio": "home",
  "/studio/users": "analytics",
  "/studio/about": "user-round",
  "/studio/projects": "folder-git",
  "/studio/stacks": "layers",
  "/admin": "shield",
  "/admin/users": "users",
  "/admin/feedback": "message",
};

const NAV_TINT: Record<string, string> = {
  "/studio": "bg-primary",
  "/studio/users": "bg-emerald-500",
  "/studio/about": "bg-orange-500",
  "/studio/projects": "bg-blue-500",
  "/studio/stacks": "bg-purple-500",
  "/admin": "bg-rose-500",
  "/admin/users": "bg-cyan-600",
  "/admin/feedback": "bg-amber-500",
};

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/studio" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-2 px-0">
        <AppCommand />
      </SidebarHeader>
      <SidebarContent className="bg-ios-grouped gap-6 rounded-xl px-2 py-2">
        {APP_LINKS.map((group) => (
          <GroupedList key={group.title} header={group.title}>
            {group.links.map((link) => (
              <ListRow
                key={link.href}
                as={Link}
                href={link.href}
                leading={
                  <IconTile
                    name={NAV_ICON[link.href] ?? "home"}
                    className={NAV_TINT[link.href]}
                  />
                }
                title={link.label}
                showChevron
                className={
                  isActive(link.href)
                    ? "bg-ios-separator/40 font-medium"
                    : undefined
                }
              />
            ))}
          </GroupedList>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2 px-0">
        <SidebarUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
