import { NavUser } from "@/components/Sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { USER_ROLE } from "@/lib/constants";
import { Ambulance, Home, Map } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

const navItems = [
  {
    name: "Dashboard",
    url: "/",
    icon: Home,
    roles: [USER_ROLE.ADMIN, USER_ROLE.WAREHOUSE, USER_ROLE.INSTITUTION],
  },
  {
    name: "Manufacturers",
    url: "/manufacturers",
    icon: Home,
    roles: [USER_ROLE.ADMIN, USER_ROLE.WAREHOUSE],
  },
  {
    name: "Salts",
    url: "/salts",
    icon: Map,
    roles: [USER_ROLE.ADMIN, USER_ROLE.WAREHOUSE],
  },
  {
    name: "Medicines",
    url: "/medicines",
    icon: Map,
    roles: [USER_ROLE.ADMIN, USER_ROLE.WAREHOUSE],
  },
];

export function AppSidebar({ ...props }) {
  const { user, userRole } = useSelector((root) => root.user);
  const { pathname } = useLocation();

  const filteredNavItems = useMemo(() => navItems.filter((item) => item.roles.includes(userRole)), [userRole]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Ambulance className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">MedLogix</span>
            <span className="truncate text-xs">Drug Monitoring System</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton isActive={pathname === item.url} tooltip={item.name} asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} userRole={userRole} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
