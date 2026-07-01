import { getRequiredAdmin } from "@/lib/auth/auth-user";
import type { LayoutParams } from "@/types/next";
import { AppNavigation } from "./_navigation/app-navigation";

// `/studio` is the authenticated back-office. It was originally mounted at
// `/app` (renamed to `/studio` in Spec 01), hence the `App*` navigation names
// kept below. Mono-tenant: the whole section is owner-only (admin role).
export default async function StudioLayout(props: LayoutParams) {
  await getRequiredAdmin();
  return <AppNavigation>{props.children}</AppNavigation>;
}
