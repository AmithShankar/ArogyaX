"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

/**
 * Tiny utility component to clear the isInitialLogin flag
 * once a protected page has actually mounted/hydrated.
 */
export function InitialLoginClearer() {
  const setInitialLogin = useAuthStore((state) => state.setInitialLogin);
  const isInitialLogin = useAuthStore((state) => state.isInitialLogin);

  useEffect(() => {
    if (isInitialLogin) {
      // Small buffer to allow the final fade-in animation of the dashboard to sync
      const timer = setTimeout(() => {
        setInitialLogin(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInitialLogin, setInitialLogin]);

  return null;
}
