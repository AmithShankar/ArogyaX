import { AppLayout } from "@/components/layout/AppLayout";
import { LOGIN_ROUTE } from "@/lib/app-config";
import { getUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect(LOGIN_ROUTE);
  }

  if (user.passwordType === "admin_created") {
    redirect("/change-password");
  }

  return <AppLayout>{children}</AppLayout>;
}
