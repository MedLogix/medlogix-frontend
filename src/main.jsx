import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Providers from "./components/Providers";
import "./index.css";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminLogin from "./pages/auth/AdminLogin";
import Login from "./pages/auth/Login";
import DashboardHome from "./pages/dashboard/Home";
import Manufacturers from "./pages/dashboard/Manufacturers";
import Medicines from "./pages/dashboard/Medicines";
import Salts from "./pages/dashboard/Salts";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/salts" element={<Salts />} />
              <Route path="/medicines" element={<Medicines />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>
);
