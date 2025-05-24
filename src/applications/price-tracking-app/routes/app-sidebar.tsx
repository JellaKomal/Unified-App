import { NavLink } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"; // shadcn's utility for className concatenation

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AppSidebarProps {
  navItems: NavItem[];
}

export function AppSidebar({ navItems }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="bg-white">
      <SidebarContent>
        <SidebarGroup>
          {navItems.map((item) => (
            // <SidebarItem key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 p-2 rounded-md",
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
            // </SidebarItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
