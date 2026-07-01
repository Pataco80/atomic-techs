import { Typography } from "@/components/nowts/typography";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";

export default async function AppUsersPage() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="text-3xl font-bold tracking-tight">
          Analytics
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4 lg:gap-8">
        <div className="bg-ios-card rounded-xl p-6 shadow-sm">
          <Typography variant="large" as="h3" className="font-semibold">
            User Analytics
          </Typography>
          <Typography variant="muted" className="text-ios-secondary-label mt-2">
            Your personal analytics and usage statistics will be displayed here.
          </Typography>
        </div>
      </LayoutContent>
    </Layout>
  );
}
