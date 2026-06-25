import { getRequiredAdmin } from "@/lib/auth/auth-user";
import type { LayoutParams } from "@/types/next";
import { AppNavigation } from "./_navigation/app-navigation";

export default async function StudioLayout(props: LayoutParams) {
  // Mono-tenant back-office: the whole /studio section is owner-only (admin role).
  await getRequiredAdmin();
  return <AppNavigation>{props.children}</AppNavigation>;
}
