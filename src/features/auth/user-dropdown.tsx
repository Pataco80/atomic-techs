"use client";

import { Typography } from "@/components/nowts/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iosMenuContent, iosMenuItem } from "@/components/ios";
import { Icon } from "@/components/shared/icons";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { UserDropdownLogout } from "./user-dropdown-logout";
import { UserDropdownStopImpersonating } from "./user-dropdown-stop-impersonating";

export const UserDropdown = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const theme = useTheme();

  if (!session.data?.user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-56", iosMenuContent)}>
        <DropdownMenuLabel>
          {session.data.user.name ? (
            <>
              <Typography variant="small">
                {session.data.user.name || session.data.user.email}
              </Typography>
              <Typography variant="muted">{session.data.user.email}</Typography>
            </>
          ) : (
            <Typography variant="small">{session.data.user.email}</Typography>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={iosMenuItem} asChild>
          <Link href="/studio">
            <Icon name="dashboard" className="mr-2 size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className={iosMenuItem} asChild>
          <Link href="/account">
            <Icon name="settings" className="mr-2 size-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        {session.data.user.role === "admin" && (
          <DropdownMenuItem className={iosMenuItem} asChild>
            <Link href="/admin">
              <Icon name="shield" className="mr-2 size-4" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={iosMenuItem}>
            <Icon
              name="sun-moon"
              className="text-muted-foreground mr-4 size-4"
            />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className={iosMenuContent}>
              <DropdownMenuItem
                className={iosMenuItem}
                onClick={() => theme.setTheme("dark")}
              >
                <Icon name="moon" className="mr-2 size-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={iosMenuItem}
                onClick={() => theme.setTheme("light")}
              >
                <Icon name="sun-medium" className="mr-2 size-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={iosMenuItem}
                onClick={() => theme.setTheme("system")}
              >
                <Icon name="monitor" className="mr-2 size-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <UserDropdownLogout />
          {session.data.session.impersonatedBy ? (
            <UserDropdownStopImpersonating />
          ) : null}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
