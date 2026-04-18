import { LOGIN_ROUTE, PASSWORD_TYPE_COOKIE } from "@/lib/app-config";
import {
    ApiRequestError,
    changePasswordApi,
    loginApi,
    logoutApi,
    meApi
} from "@/services/apiClient";
import { AuthState } from "@/types";
import Cookies from "js-cookie";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  permissions: null,
  isLoggingOut: false,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({ 
      user, 
      permissions: user?.permissions ?? null,
      isAuthenticated: !!user && user.passwordType === "user_created",
      isLoading: false
    });
  },

  hydrate: async () => {
    try {
      const currentUser = await meApi();
      get().setUser(currentUser);
      Cookies.set(PASSWORD_TYPE_COOKIE, currentUser.passwordType, { expires: 7 });
    } catch {
      set({ user: null, permissions: null, isAuthenticated: false, isLoading: false });
      Cookies.remove(PASSWORD_TYPE_COOKIE);
    }
  },

  login: async (phone, password) => {
    try {
      await loginApi({ phone, password });
      const currentUser = await meApi();
      
      get().setUser(currentUser);
      Cookies.set(PASSWORD_TYPE_COOKIE, currentUser.passwordType, { expires: 7 });

      return {
        success: true,
        needsPasswordChange: currentUser.passwordType === "admin_created",
      };
    } catch (error) {
      return {
        success: false,
        needsPasswordChange: false,
        error: error instanceof ApiRequestError ? error.message : "Unable to sign in",
      };
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await logoutApi();
    } catch {
      // Best effort
    }
    Cookies.remove(PASSWORD_TYPE_COOKIE);
    set({ user: null, permissions: null, isAuthenticated: false });
    window.location.href = LOGIN_ROUTE;
  },

  changePassword: async (newPassword, router) => {
    await changePasswordApi(newPassword);
    const currentUser = await meApi();
    
    get().setUser(currentUser);
    Cookies.set(PASSWORD_TYPE_COOKIE, currentUser.passwordType, { expires: 7 });
    
    router.push("/dashboard");
    router.refresh();
  }
}));
