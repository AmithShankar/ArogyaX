import { User } from "@/types";
import { safeServerApi, serverApi } from "./base";

export async function fetchCurrentUser() {
  return safeServerApi<User>("/auth/me");
}

export async function fetchUsers() {
  return serverApi<User[]>("/users");
}
