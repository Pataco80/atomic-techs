import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import type { PropsWithChildren } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Typography } from "@/components/nowts/typography";
export async function AdminNavigation({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-ios-grouped">
        <header className="bg-ios-grouped flex h-16 shrink-0 items-center gap-2">
          <Layout size="lg" className="flex items-center gap-2">
            <SidebarTrigger
              size="lg"
              variant="outline"
              className="size-9 cursor-pointer rounded-full"
            />
            <div className="flex items-center gap-2">
              <Typography as="span" variant="default" className="font-semibold">
                Admin Panel
              </Typography>
            </div>
          </Layout>
        </header>
        <div className="bg-ios-grouped flex flex-1 flex-col gap-8 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
