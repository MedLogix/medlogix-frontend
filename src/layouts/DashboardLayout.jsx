import { AppSidebar } from "@/components/AppSidebar";
import Chatbot from "@/components/Chatbot";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const { userRole } = useSelector((state) => state.user);

  return (
    <>
      <Helmet>
        <title>{`MedLogix - ${userRole}`}</title>
      </Helmet>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Chatbot />
    </>
  );
}
