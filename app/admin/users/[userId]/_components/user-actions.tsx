"use client";

import {
  iosMenuContent,
  iosMenuItem,
  iosMenuItemDestructive,
} from "@/components/ios";
import { Icon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
};

type UserActionsProps = {
  user: User;
};

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter();

  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      return unwrapSafePromise(
        authClient.admin.impersonateUser({
          userId,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Impersonation started");
      // Land on the user-facing account area (any role) — /studio is owner-only.
      router.push("/account");
    },
    onError: (error: Error) => {
      toast.error(`Failed to impersonate user: ${error.message}`);
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason?: string;
    }) => {
      return unwrapSafePromise(
        authClient.admin.banUser({
          userId,
          banReason: reason ?? "Banned by admin",
        }),
      );
    },
    onSuccess: () => {
      toast.success("User banned successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ban user: ${error.message}`);
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return unwrapSafePromise(
        authClient.admin.unbanUser({
          userId,
        }),
      );
    },
    onSuccess: () => {
      toast.success("User unbanned successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to unban user: ${error.message}`);
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "admin" | "user";
    }) => {
      return unwrapSafePromise(
        authClient.admin.setRole({
          userId,
          role,
        }),
      );
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Icon name="more-horizontal" className="mr-2 size-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={iosMenuContent}>
        {!user.banned && (
          <DropdownMenuItem
            className={iosMenuItem}
            onClick={() => impersonateMutation.mutate(user.id)}
            disabled={impersonateMutation.isPending}
          >
            <Icon name="eye" className="mr-2 size-4" />
            Impersonate User
          </DropdownMenuItem>
        )}

        {user.role !== "admin" && (
          <DropdownMenuItem
            className={iosMenuItem}
            onClick={() =>
              setRoleMutation.mutate({
                userId: user.id,
                role: "admin" as const,
              })
            }
            disabled={setRoleMutation.isPending}
          >
            <Icon name="crown" className="mr-2 size-4" />
            Make Admin
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {user.banned ? (
          <DropdownMenuItem
            className={iosMenuItem}
            onClick={() => unbanUserMutation.mutate(user.id)}
            disabled={unbanUserMutation.isPending}
          >
            <Icon name="user-check" className="mr-2 size-4" />
            Unban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => banUserMutation.mutate({ userId: user.id })}
            disabled={banUserMutation.isPending}
            className={cn(
              iosMenuItemDestructive,
              "text-destructive focus:text-destructive",
            )}
          >
            <Icon name="ban" className="mr-2 size-4" />
            Ban User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
