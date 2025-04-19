import apiClient from "@/lib/axios";

const WarehouseService = {
  getWarehouses: (payload) => {
    return apiClient.get("/api/v1/warehouse", payload);
  },
  getWarehouseById: (id) => {
    return apiClient.get(`/api/v1/warehouse/${id}`);
  },
  approveWarehouse: (id) => {
    return apiClient.post(`/api/v1/warehouse/approve/${id}`);
  },
  rejectWarehouse: (id, payload) => {
    return apiClient.post(`/api/v1/warehouse/reject/${id}`, payload);
  },
};

export default WarehouseService;
