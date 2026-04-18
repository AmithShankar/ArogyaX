"use client";
import { cn } from "@/lib/utils";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/app-config";
import { NavItem } from "@/types";
import {
    BarChart3,
    FlaskConical,
    HeartPulse,
    LayoutDashboard,
    LogOut,
    Pill,
    Receipt,
    ScrollText, UserRound,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "doctor",
      "nurse",
      "reception",
      "pharmacy",
      "lab_tech",
      "hospital_admin",
      "owner",
      "auditor",
    ],
    description: "Overview",
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
    roles: ["doctor", "nurse", "reception", "lab_tech", "pharmacy", "hospital_admin", "owner", "auditor"],
    description: "Directory",
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: Pill,
    roles: ["doctor", "nurse", "pharmacy", "owner", "auditor"],
    description: "Medication",
  },
  {
    title: "Lab Results",
    url: "/labs",
    icon: FlaskConical,
    roles: ["doctor", "nurse", "lab_tech", "owner", "auditor"],
    description: "Diagnostics",
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Receipt,
    roles: ["reception", "hospital_admin", "owner", "pharmacy", "auditor"],
    description: "Invoices",
  },
  {
    title: "Admin Dashboard",
    url: "/admin",
    icon: BarChart3,
    roles: ["hospital_admin", "owner", "auditor"],
    description: "Analytics",
  },
  {
    title: "User Management",
    url: "/users",
    icon: UserRound,
    roles: ["hospital_admin", "owner", "auditor"],
    description: "Staff",
  },
  {
    title: "Audit Log",
    url: "/audit-log",
    icon: ScrollText,
    roles: ["hospital_admin", "owner", "auditor"],
    description: "History",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === "collapsed";
  const isMobile = sidebar?.isMobile;

  if (!user) return null;

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      sidebar.setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/70 bg-sidebar-background/98"
    >
      <SidebarContent className="flex h-full flex-col !overflow-hidden">
        <div className="shrink-0 border-b border-sidebar-border/60 px-3 pb-3 pt-3">
          <div className="flex items-center gap-3 px-1">
            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-none">
              <HeartPulse className="size-5" />
            </div>
            <div
              className={cn(
                "min-w-0 overflow-hidden whitespace-nowrap",
                "transition-[max-width,opacity] duration-200 ease-linear",
                collapsed ? "max-w-0 opacity-0" : "max-w-[10rem] opacity-100",
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground">
                Clinical Operations
              </p>
              <span className="mt-0.5 block truncate text-lg font-bold text-sidebar-foreground">
                {APP_NAME}
              </span>
            </div>
          </div>
        </div>

        <SidebarGroup className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          <SidebarGroupContent>
            <div
              className={cn(
                "overflow-hidden whitespace-nowrap",
                "transition-[max-height,opacity] duration-200 ease-linear",
                collapsed
                  ? "max-h-0 opacity-0 mb-0"
                  : "max-h-8 opacity-100 mb-2",
              )}
            >
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/80">
                Navigation
              </p>
            </div>
            <SidebarMenu className="space-y-1.5">
              {visibleItems.map((item) => {
                const active = isActive(item.url);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className={`h-auto w-full justify-start rounded-xl px-3 py-2 transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Link
                        href={item.url}
                        onClick={closeMobileSidebar}
                        className={cn(
                          "flex w-full items-center transition-[gap] duration-200 ease-linear",
                          collapsed ? "gap-0" : "gap-3",
                        )}
                      >
                        <item.icon
                          className={`size-5 shrink-0 transition-colors ${
                            active
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                          }`}
                        />
                        <div
                          className={cn(
                            "min-w-0 overflow-hidden whitespace-nowrap",
                            "transition-[max-width,opacity] duration-200 ease-linear",
                            collapsed
                              ? "max-w-0 opacity-0"
                              : "max-w-[160px] opacity-100",
                          )}
                        >
                          <span className="block text-sm font-semibold leading-5">
                            {item.title}
                          </span>
                          <span className="block text-xs text-sidebar-foreground/70 font-medium">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto shrink-0 space-y-2 border-t border-sidebar-border/60 p-3 group-data-[collapsible=icon]:items-center">
          <SidebarMenu className="space-y-1.5">
            <SidebarMenuItem className="px-3 py-1">
              <div className="h-px bg-sidebar-border/40 w-full" />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-auto w-full justify-start rounded-xl px-3 py-2.5 font-medium text-rose-500/85 transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                onClick={logout}
              >
                <div
                  className={cn(
                    "flex w-full cursor-pointer items-center transition-[gap] duration-200 ease-linear",
                    collapsed ? "gap-0" : "gap-3",
                  )}
                >
                  <LogOut className="size-5 shrink-0" />
                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap",
                      "transition-[max-width,opacity] duration-200 ease-linear",
                      collapsed ? "max-w-0 opacity-0" : "max-w-[100px] opacity-100",
                    )}
                  >
                    Sign Out
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

        </div>
      </SidebarContent>
    </Sidebar>
  );
}
