import apiClient from "@/lib/axios";

const WarehouseStockService = {
  getWarehouseStock: (payload) => {
    return apiClient.get("/api/v1/warehouse-stock", payload);
  },
  getWarehouseStockById: (id) => {
    return apiClient.get(`/api/v1/warehouse-stock/${id}`);
  },
  updateWarehouseStock: (id, payload) => {
    return apiClient.put(`/api/v1/warehouse-stock/${id}`, payload);
  },
  deleteWarehouseStock: (id) => {
    return apiClient.delete(`/api/v1/warehouse-stock/${id}`);
  },
  getAllWarehouseStock: (payload) => {
    return apiClient.get("/api/v1/warehouse-stock/admin", payload);
  },
  getAvailableWarehouseStock: (payload) => {
    return apiClient.get("/api/v1/warehouse-stock/available", payload);
  },
  createWarehouseStock: (payload) => {
    return apiClient.post("/api/v1/warehouse-stock", payload);
  },
};

export default WarehouseStockService;
