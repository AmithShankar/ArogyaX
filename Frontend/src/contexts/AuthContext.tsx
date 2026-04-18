"use client";

import { useAuthStore } from "@/store/authStore";
import { AuthContextType } from "@/types";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const { 
    user, 
    permissions, 
    login, 
    logout, 
    changePassword: rawChangePassword, 
    isAuthenticated,
    isLoggingOut,
    hydrate 
  } = useAuthStore();

  useEffect(() => {
    const isAuthRoute = pathname === "/login" || pathname === "/change-password";
    if (!isAuthRoute) {
      hydrate();
    }
  }, [pathname, hydrate]);

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background p-6">
        <div className="relative mb-8 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative h-12 w-12 rounded-2xl border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Logging out safely
          </h2>
          <p className="mt-2 text-sm text-muted-foreground animate-pulse">
            Terminating your secure session...
          </p>
        </div>
        <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
           ArogyaX · Healthcare Operations
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        changePassword: rawChangePassword as any,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
