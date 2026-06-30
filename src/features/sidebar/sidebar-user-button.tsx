"use client";

import { Typography } from "@/components/nowts/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { ChevronsUpDown } from "lucide-react";
import { UserDropdown } from "../auth/user-dropdown";

export const SidebarUserButton = () => {
  const session = useSession();
  const data = session.data?.user;

  return (
    <UserDropdown>
      <SidebarMenuButton variant="outline" className="h-12 rounded-xl">
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={data?.image ?? ""} alt={data?.name[0]} />
          <AvatarFallback className="rounded-lg">
            {data?.name[0] ?? data?.email[0]}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left leading-tight">
          <Typography
            as="span"
            variant="default"
            className="truncate font-semibold"
          >
            {data?.name}
          </Typography>
          <Typography as="span" variant="tiny" className="truncate">
            {data?.email}
          </Typography>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </UserDropdown>
  );
};
