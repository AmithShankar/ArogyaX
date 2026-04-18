import { User } from "@/types";
import { clientApi } from "./base";

export const loginApi = (credentials: { phone: string; password: string }) =>
  clientApi<string>("/auth/login", {
    method: "POST",
    body: credentials,
    skipAuthRedirect: true,
  });

export const logoutApi = () =>
  clientApi<string>("/auth/logout", {
    method: "POST",
  });

export const meApi = () => clientApi<User>("/auth/me");

export const changePasswordApi = (newPassword: string) =>
  clientApi<string>("/auth/change-password", {
    method: "POST",
    body: { newPassword },
  });
