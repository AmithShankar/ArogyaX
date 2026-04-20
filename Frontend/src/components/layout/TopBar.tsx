"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/app-config";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/types";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/patients/"))
    return { title: "Patient Record",      subtitle: "Clinical timeline, prescriptions, labs & billing" };
  if (pathname.startsWith("/patients"))
    return { title: "Patient Directory",   subtitle: "Search, register, and review the patient roster" };
  if (pathname.startsWith("/prescriptions"))
    return { title: "Prescriptions",       subtitle: "Active medications and dispensing workflow" };
  if (pathname.startsWith("/labs"))
    return { title: "Labs",                subtitle: "Uploads and recent diagnostic activity" };
  if (pathname.startsWith("/users"))
    return { title: "User Management",     subtitle: "Staff access, roles, and account status" };
  if (pathname.startsWith("/audit-log"))
    return { title: "Audit Log",           subtitle: "System actions and access history" };
  if (pathname.startsWith("/admin"))
    return { title: "Admin Overview",      subtitle: "Staffing, revenue, and operational visibility" };
  return   { title: "Operations Dashboard", subtitle: "Care delivery, coordination, and workflow status" };
}

export function TopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // If user is not loaded yet, render a high-fidelity skeleton to anchor the layout
  if (!user) {
    return (
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-sidebar-border/50">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />
        
        <div className="page-shell py-0">
          <div className="flex h-[4.5rem] items-center gap-3">
             {/* Left Controls */}
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/40 border border-border/70 animate-pulse" />
                <div className="h-6 w-px bg-border/60" />
             </div>

             {/* Title Section - Perfectly Aligned */}
             <div className="flex-1 min-w-0">
               <div className="space-y-2 animate-pulse">
                 <div className="h-2 w-24 bg-primary/10 rounded" />
                 <div className="h-4 w-48 bg-muted/40 rounded" />
               </div>
             </div>

             {/* Right Actions */}
             <div className="flex items-center gap-2 shrink-0 animate-pulse">
                <div className="hidden lg:block h-10 w-32 rounded-xl bg-muted/10 border border-border/70" />
                <div className="h-10 w-10 rounded-xl bg-muted/20" />
                <div className="h-10 w-10 rounded-xl bg-muted/20" />
                <div className="flex items-center gap-3 h-10 pl-2 pr-3.5 rounded-xl border border-border/70 bg-card/40">
                   <div className="h-7 w-7 rounded-full bg-muted/30" />
                   <div className="hidden sm:block space-y-1">
                      <div className="h-3 w-16 bg-muted/30 rounded" />
                      <div className="h-2 w-10 bg-muted/10 rounded" />
                   </div>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-border/50" />
      </header>
    );
  }

  const pageMeta = getPageMeta(pathname);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />

      <div className="page-shell py-0">
        <div className="flex h-[4.5rem] items-center gap-3">

          <SidebarTrigger
            className={cn(
              "h-10 w-10 shrink-0 rounded-xl border border-border/70",
              "bg-background shadow-none hover:bg-accent",
              "text-foreground transition-colors",
            )}
          />

          <div className="h-6 w-px shrink-0 bg-border/60" />

          <div className="min-w-0 flex-1">
            <p className="text-primary font-bold tracking-widest uppercase text-[10px] leading-none mb-1.5">
              {APP_NAME}
            </p>
            <h1 className="text-[1.05rem] font-semibold text-foreground truncate leading-tight">
              {pageMeta.title}
            </h1>
            <p className="hidden md:block text-xs text-muted-foreground font-medium truncate leading-tight mt-0.5">
              {pageMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">

            <button
              className={cn(
                "hidden lg:flex items-center gap-2 h-10 px-3.5 rounded-xl",
                "border border-border/70 bg-muted/30",
                "text-sm text-foreground hover:bg-muted/60 transition-colors",
              )}
              type="button"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span>Search</span>
              <kbd className="ml-1 text-[10px] opacity-40 font-mono">⌘K</kbd>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl text-foreground hover:bg-muted/60"
            >
              <Bell className="h-[1.1rem] w-[1.1rem]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-foreground hover:bg-muted/60"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-[1.1rem] w-[1.1rem]" />
              ) : (
                <Moon className="h-[1.1rem] w-[1.1rem]" />
              )}
            </Button>

            <div className={cn(
              "flex items-center gap-3 h-10 pl-2 pr-3.5 rounded-xl",
              "border border-border/70 bg-card cursor-default select-none",
            )}>
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block min-w-0">
                <p className="truncate text-sm font-semibold text-foreground leading-tight max-w-[140px]">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground leading-tight">
                  {ROLE_LABELS[user.role]}
                  {user.role !== "owner" && user.jobTitle ? ` · ${user.jobTitle}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-border/50" />
    </header>
  );
}
