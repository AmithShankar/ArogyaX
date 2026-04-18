import { AppLayoutProps } from "@/types";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { RouteTransition } from "./RouteTransition";
import { TopBar } from "./TopBar";

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="relative flex min-h-screen w-full flex-1 flex-col bg-background">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <RouteTransition>{children}</RouteTransition>
        </div>
      </main>
    </SidebarProvider>
  );
}
