import { AppSidebar } from "@/components/AppSidebar";
import FullScreenLoader from "@/components/FullScreenLoader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { isUserAuthenticated } from "@/lib/utils";
import UserService from "@/services/userService";
import { setUser } from "@/store/user/slice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.user);
  const isAuthenticated = isUserAuthenticated();
  const navigate = useNavigate();
  const [isLoadingGetMyProfile, setIsLoadingGetMyProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoadingGetMyProfile(true);
    if (isAuthenticated) {
      try {
        const userResponse = await UserService.currentUser();

        const user = userResponse.data.data;

        dispatch(setUser(user));
      } catch (error) {
        console.log(error);
        navigate("/login");
      }
    }
    setIsLoadingGetMyProfile(false);
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [fetchProfile, user]);

  if (isAuthenticated) {
    if (isLoadingGetMyProfile) {
      return <FullScreenLoader />;
    }
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return <Navigate to="/login" />;
}
