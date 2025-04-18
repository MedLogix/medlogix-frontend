import { Ambulance } from "lucide-react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Ambulance className="size-4" />
          </div>
          MedLogix
        </a>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
