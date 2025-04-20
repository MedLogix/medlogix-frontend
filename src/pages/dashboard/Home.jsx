import { USER_ROLE } from "@/lib/constants";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import InstitutionDashboard from "./InstitutionDashboard";
import WarehouseDashboard from "./WarehouseDashboard";

const DashboardHome = () => {
  const { userRole } = useSelector((root) => root.user);

  const renderDashboard = useMemo(() => {
    if (userRole === USER_ROLE.ADMIN) {
      return <AdminDashboard />;
    }
    if (userRole === USER_ROLE.INSTITUTION) {
      return <InstitutionDashboard />;
    }
    if (userRole === USER_ROLE.WAREHOUSE) {
      return <WarehouseDashboard />;
    }
  }, [userRole]);

  return renderDashboard;
};

export default DashboardHome;
