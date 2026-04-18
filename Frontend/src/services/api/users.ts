import { User, UserRole } from "@/types";
import { clientApi } from "./base";

export const createUserApi = (payload: {
  phone: string;
  name: string;
  role: UserRole;
  jobTitle?: string;
  password: string;
  passwordType?: "admin_created" | "user_created";
}) =>
  clientApi<User>("/users", {
    method: "POST",
    body: {
      ...payload,
      passwordType: payload.passwordType ?? "admin_created",
      status: "active",
    },
  });

export const listUsersApi = () => clientApi<User[]>("/users");

export const updateUserApi = (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    role?: UserRole;
    jobTitle?: string;
    status?: "active" | "inactive" | "suspended";
  },
) =>
  clientApi<User>(`/users/${userId}`, {
    method: "PUT",
    body: payload,
  });

export const deactivateUserApi = (userId: string) =>
  clientApi<string>(`/users/${userId}`, {
    method: "DELETE",
  });
