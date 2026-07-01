"use client";

import {
  iosMenuContent,
  iosMenuItem,
  iosMenuItemDestructive,
} from "@/components/ios";
import { Icon } from "@/components/shared/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserTableCell } from "../../_components/user-table-cell";
import type { UserWithStats } from "../_actions/admin-users";

type UserRowProps = {
  user: UserWithStats;
};

export const UserRow = ({ user }: UserRowProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onUserUpdate = () => {
    router.refresh();
  };

  // Ban user mutation
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
      onUserUpdate();
    },
    onError: (error: Error) => {
      toast.error(`Failed to ban user: ${error.message}`);
    },
  });

  // Unban user mutation
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
      onUserUpdate();
    },
    onError: (error: Error) => {
      toast.error(`Failed to unban user: ${error.message}`);
    },
  });

  // Impersonate user mutation
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
      // Refresh the page to update the session
      void queryClient.invalidateQueries();
      // Land on the user-facing account area (any role) — /studio is owner-only.
      router.push("/account");
    },
    onError: (error: Error) => {
      toast.error(`Failed to impersonate user: ${error.message}`);
    },
  });

  // Set user role mutation
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
      onUserUpdate();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });

  return (
    <TableRow key={user.id}>
      <TableCell>
        <UserTableCell user={user} href={`/admin/users/${user.id}`} />
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role ?? "user"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid="user-row-menu-button"
              >
                <Icon name="more-horizontal" className="size-4" />
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
                  Impersonate
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
                  variant="destructive"
                  className={iosMenuItemDestructive}
                >
                  <Icon name="ban" className="mr-2 size-4" />
                  Ban User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
