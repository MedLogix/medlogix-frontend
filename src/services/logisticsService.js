import apiClient from "@/lib/axios";

const logisticsService = {
  createLogistics: (payload) => {
    return apiClient.post("/api/v1/logistics", payload);
  },

  updateLogisticsStatus: (logisticsId, payload) => {
    return apiClient.patch(`/api/v1/logistics/${logisticsId}/status`, payload);
  },

  markAsReceived: (logisticsId) => {
    return apiClient.patch(`/api/v1/logistics/${logisticsId}/receive`);
  },
};

export default logisticsService;
