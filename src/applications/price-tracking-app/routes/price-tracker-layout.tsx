import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, BarChart2, LogIn } from "lucide-react";
import { AppSidebar } from "./app-sidebar";

// Navigation items for the price tracker app
interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/price-tracking-app", icon: Home },
  { name: "Dashboard", path: "/price-tracking-app/dashboard", icon: BarChart2 },
  { name: "Login", path: "/price-tracking-app/login", icon: LogIn },
];

export default function PriceTrackerLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar (using shadcn's AppSidebar) */}
        <AppSidebar navItems={navItems} />

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center space-x-2">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold text-gray-800">
                Price Tracker
              </h1>
            </div>
            <Button variant="outline">User Profile</Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
