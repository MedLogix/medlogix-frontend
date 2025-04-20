import apiClient from "@/lib/axios";

const AnalyticsService = {
  getAdminKpis: (payload) => {
    return apiClient.get("/api/v1/analytics/admin/kpi", payload);
  },
  getAdminCharts: (payload) => {
    return apiClient.get("/api/v1/analytics/admin/charts", payload);
  },
  getInstitutionKpis: (payload) => {
    return apiClient.get("/api/v1/analytics/institution/kpi", payload);
  },
  getInstitutionCharts: (payload) => {
    return apiClient.get("/api/v1/analytics/institution/charts", payload);
  },
  getWarehouseKpis: (payload) => {
    return apiClient.get("/api/v1/analytics/warehouse/kpi", payload);
  },
  getWarehouseCharts: (payload) => {
    return apiClient.get("/api/v1/analytics/warehouse/charts", payload);
  },
};

export default AnalyticsService;
