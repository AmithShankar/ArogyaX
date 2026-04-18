import { fetchUsers } from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import { UserManagementClient } from "./_components/UserManagementClient";

export const metadata: Metadata = {
  title: "User Management | ArogyaX",
};

import { UNAUTHORIZED_ROUTE } from "@/lib/app-config";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
  const user = await getUser();
  if (!user || (!user.permissions.canManageUsers && user.role !== "auditor")) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  const initialUsers = await fetchUsers();

  return <UserManagementClient initialUsers={initialUsers} />;
}
