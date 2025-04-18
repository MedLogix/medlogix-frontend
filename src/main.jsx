import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Providers from "./components/Providers";
import "./index.css";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/Home";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminLogin from "./pages/auth/AdminLogin";

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
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>
);
