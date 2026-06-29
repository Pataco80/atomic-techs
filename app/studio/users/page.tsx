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
        <LayoutTitle>Analytics</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4 lg:gap-8">
        <div className="rounded-lg border p-6">
          <Typography variant="large" as="h3" className="font-semibold">
            User Analytics
          </Typography>
          <Typography variant="muted" className="mt-2">
            Your personal analytics and usage statistics will be displayed here.
          </Typography>
        </div>
      </LayoutContent>
    </Layout>
  );
}
