import apiClient from "@/lib/axios";

const LogService = {
  getInstitutionLogs: (payload) => {
    return apiClient.get("/api/v1/logs/institution", payload);
  },

  getWarehouseLogs: (payload) => {
    return apiClient.get("/api/v1/logs/warehouse", payload);
  },
};

export default LogService;
