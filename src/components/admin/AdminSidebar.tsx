import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Coffee, 
  Newspaper, 
  Settings, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Key
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Drinks Management", url: "/admin/drinks", icon: Coffee },
  { title: "News Management", url: "/admin/news", icon: Newspaper },
  { title: "API Keys", url: "/admin/api-keys", icon: Key },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAdminAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50";

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-accent-foreground">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}