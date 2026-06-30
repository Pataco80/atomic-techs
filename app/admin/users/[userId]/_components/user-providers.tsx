"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@/components/shared/icons";

type Account = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserProvidersProps = {
  accounts: Account[];
};

export function UserProviders({ accounts }: UserProvidersProps) {
  const getProviderIcon = (providerId: string) => {
    switch (providerId.toLowerCase()) {
      case "github":
        return <Icon name="github" className="size-4" />;
      case "google":
        return <Icon name="mail" className="size-4" />;
      case "credential":
      case "credentials":
        return <Icon name="shield" className="size-4" />;
      default:
        return <Icon name="shield" className="size-4" />;
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId.toLowerCase()) {
      case "github":
        return "GitHub";
      case "google":
        return "Google";
      case "credential":
      case "credentials":
        return "Email/Password";
      default:
        return providerId;
    }
  };

  return (
    <Card className="bg-ios-card border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Authentication Providers</CardTitle>
        <CardDescription>
          Connected authentication methods for this user
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center">
            No authentication providers found
          </div>
        ) : (
          <div className="border-ios-separator overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Connected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getProviderIcon(account.providerId)}
                        <div className="font-medium">
                          {getProviderName(account.providerId)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{account.accountId}</code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          account.accessTokenExpiresAt &&
                          new Date(account.accessTokenExpiresAt) > new Date()
                            ? "default"
                            : account.accessToken
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {account.accessTokenExpiresAt &&
                        new Date(account.accessTokenExpiresAt) > new Date()
                          ? "Active"
                          : account.accessToken
                            ? "Connected"
                            : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(account.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
