"use client";
import * as React from "react";
import { AppLayoutProps } from "@/types";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { RouteTransition } from "./RouteTransition";
import { TopBar } from "./TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";

export function AppLayout({ children }: AppLayoutProps) {
  const [mounted, setMounted] = React.useState(false);
  const { isInitialLogin, setInitialLogin } = useAuth();

  React.useEffect(() => {
    setMounted(true);
    
    // Drop the initial login curtain after a small buffer
    if (isInitialLogin) {
      const timer = setTimeout(() => {
        setInitialLogin(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInitialLogin, setInitialLogin]);

  return (
    <SidebarProvider defaultOpen={true}>
      {mounted ? (
        <>
          <AppSidebar />
          <main className="relative flex h-screen w-full flex-1 flex-col overflow-hidden bg-background font-outfit">
            <TopBar />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <RouteTransition>{children}</RouteTransition>
            </div>
          </main>
        </>
      ) : (
        <main className="relative flex h-screen w-full flex-1 flex-col overflow-hidden bg-background font-outfit">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <TablePageSkeleton columns={5} rows={12} />
          </div>
        </main>
      )}
    </SidebarProvider>
  );
}
