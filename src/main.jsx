import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Providers from "./components/Providers";
import "./index.css";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminLogin from "./pages/auth/AdminLogin";
import InstitutionSignupForm from "./pages/auth/InstituitionSignup";
import Login from "./pages/auth/Login";
import SuccessfulRegistration from "./pages/auth/SuccessfulRegistration";
import WarehouseSignupForm from "./pages/auth/WarehouseSignup";
import DashboardHome from "./pages/dashboard/Home";
import Institutions from "./pages/dashboard/Institutions";
import Manufacturers from "./pages/dashboard/Manufacturers";
import Medicines from "./pages/dashboard/Medicines";
import Salts from "./pages/dashboard/Salts";
import Warehouses from "./pages/dashboard/Warehouses";
import WarehouseStock from "./pages/dashboard/WarehouseStock";
import WarehouseStockDetails from "./pages/dashboard/WarehouseStockDetails";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/institution-signup" element={<InstitutionSignupForm />} />
            <Route path="/warehouse-signup" element={<WarehouseSignupForm />} />
            <Route path="/successful-registration" element={<SuccessfulRegistration />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/salts" element={<Salts />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/warehouse-stock" element={<WarehouseStock />} />
              <Route path="/warehouse-stock/:id" element={<WarehouseStockDetails />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>
);
