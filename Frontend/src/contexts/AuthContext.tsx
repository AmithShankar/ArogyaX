"use client";

import { useAuthStore } from "@/store/authStore";
import { AuthContextType } from "@/types";
import { HeartPulse } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    user, 
    permissions, 
    login, 
    logout, 
    changePassword: rawChangePassword, 
    isAuthenticated,
    isLoggingOut,
    isLoading,
    isInitialLogin,
    setInitialLogin,
    hydrate 
  } = useAuthStore();

  useEffect(() => {
    const isAuthRoute = pathname === "/login" || pathname === "/change-password";
    if (!isAuthRoute) {
      hydrate();
    }
  }, [pathname, hydrate]);

  useEffect(() => {
    if (mounted) {
      if (isInitialLogin || isLoggingOut) {
        document.body.setAttribute("data-loading", "true");
      } else {
        document.body.removeAttribute("data-loading");
      }
    }
    return () => {
      document.body.removeAttribute("data-loading");
    };
  }, [isInitialLogin, isLoggingOut, mounted]);

  const isAuthRoute = pathname === "/login" || pathname === "/change-password";

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
      {isLoggingOut && mounted && createPortal(
        <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-background px-6">
          <div className="absolute inset-0 bg-primary/[0.01] pointer-events-none" />
          
          <div className="relative mb-12 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10 duration-[2000ms]" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-card border border-border shadow-2xl">
              <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center">
                <HeartPulse className="h-6 w-6 text-muted-foreground animate-pulse" />
              </div>
            </div>
            
            <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin [animation-duration:1.5s]" />
          </div>
          
          <div className="space-y-4 text-center max-w-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Terminating Session
            </h2>
            <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Clearing secure cache
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="h-1 w-1 animate-scale-in rounded-full bg-primary" />
                    <span className="h-1 w-1 animate-scale-in rounded-full bg-primary [animation-delay:0.2s]" />
                    <span className="h-1 w-1 animate-scale-in rounded-full bg-primary [animation-delay:0.4s]" />
                  </span>
               </div>
               <p className="text-sm text-muted-foreground font-medium italic">
                 Returning to command center entry...
               </p>
            </div>
          </div>

          <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/10">
             ArogyaX · Governance System
          </div>
        </div>,
        document.body
      )}

      {isInitialLogin && !isAuthRoute && mounted && createPortal(
        <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-background px-6">
          <div className="relative mb-12 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-primary/10 duration-1000" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)]">
              <HeartPulse className="h-10 w-10 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 text-center max-w-sm animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Initializing Session
            </h2>
            <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  Establishing Secure Link
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                  </span>
               </div>
               <p className="text-sm text-muted-foreground font-medium">
                 Synchronizing clinical workspace data...
               </p>
            </div>
          </div>
          <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
             Enterprise Clinical Solutions
          </div>
        </div>,
        document.body
      )}
    </AuthContext.Provider>
  );
};
