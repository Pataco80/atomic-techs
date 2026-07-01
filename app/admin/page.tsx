import { GroupedList, IconTile, ListRow } from "@/components/ios";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import Link from "next/link";

export default async function AdminPage() {
  await getRequiredAdmin();

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </LayoutTitle>
        <LayoutDescription>Manage users and system settings</LayoutDescription>
      </LayoutHeader>

      <LayoutContent size="default">
        <GroupedList header="Management">
          <ListRow
            as={Link}
            href="/admin/users"
            leading={<IconTile name="users" className="bg-cyan-600" />}
            title="Users"
            subtitle="View and manage all users"
            showChevron
          />
          <ListRow
            as={Link}
            href="/admin/feedback"
            leading={<IconTile name="message" className="bg-amber-500" />}
            title="Feedback"
            subtitle="Review user feedback submissions"
            showChevron
          />
        </GroupedList>
      </LayoutContent>
    </Layout>
  );
}
