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
import {
  Ambulance,
  Home,
  Building2,
  Warehouse,
  Factory,
  PillIcon,
  Package,
  ClipboardList,
  ClipboardCheck,
  Boxes,
  FileText,
  FlaskConical,
} from "lucide-react";
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
    name: "Institutions",
    url: "/institutions",
    icon: Building2,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Warehouses",
    url: "/warehouses",
    icon: Warehouse,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Manufacturers",
    url: "/manufacturers",
    icon: Factory,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Salts",
    url: "/salts",
    icon: FlaskConical,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Medicines",
    url: "/medicines",
    icon: PillIcon,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Warehouse Stock",
    url: "/warehouse-stock",
    icon: Package,
    roles: [USER_ROLE.WAREHOUSE],
  },
  {
    name: "Warehouse Logs",
    url: "/warehouse-logs",
    icon: ClipboardList,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Institution Logs",
    url: "/institution-logs",
    icon: ClipboardCheck,
    roles: [USER_ROLE.ADMIN],
  },
  {
    name: "Institution Stock",
    url: "/institution-stock",
    icon: Boxes,
    roles: [USER_ROLE.INSTITUTION],
  },
  {
    name: "Requirements",
    url: "/requirements",
    icon: FileText,
    roles: [USER_ROLE.INSTITUTION, USER_ROLE.ADMIN, USER_ROLE.WAREHOUSE],
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
