import apiClient from "@/lib/axios";

const WarehouseService = {
  getWarehouses: (payload) => {
    return apiClient.get("/api/v1/warehouse", payload);
  },
  getWarehouseById: (id) => {
    return apiClient.get(`/api/v1/warehouse/${id}`);
  },
  approveWarehouse: (id) => {
    return apiClient.post(`/api/v1/warehouse/${id}/approve`);
  },
  rejectWarehouse: (id, payload) => {
    return apiClient.post(`/api/v1/warehouse/${id}/reject`, payload);
  },
};

export default WarehouseService;
