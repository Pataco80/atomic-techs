"use client";

import { GroupedList, IconTile, ListRow } from "@/components/ios";
import type { IconKey } from "@/components/shared/icons";
import { Typography } from "@/components/nowts/typography";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminNavigation } from "./admin-navigation.links";

const NAV_ICON: Record<string, IconKey> = {
  "/admin": "home",
  "/admin/users": "users",
  "/admin/feedback": "message",
};

const NAV_TINT: Record<string, string> = {
  "/admin": "bg-rose-500",
  "/admin/users": "bg-cyan-600",
  "/admin/feedback": "bg-amber-500",
};

export function AdminSidebar() {
  const links: NavigationGroup[] = getAdminNavigation();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-0 py-1.5">
          <IconTile name="shield" className="bg-rose-500" />
          <Typography as="span" variant="default" className="font-semibold">
            Admin Panel
          </Typography>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-ios-grouped gap-6 rounded-xl px-2 py-2">
        {links.map((group) => (
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
