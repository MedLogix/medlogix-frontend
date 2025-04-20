import apiClient from "@/lib/axios";

const InstitutionStockService = {
  getInstitutionStock: (payload) => {
    return apiClient.get("/api/v1/institution-stock", payload);
  },
  getInstitutionStockById: (id) => {
    return apiClient.get(`/api/v1/institution-stock/${id}`);
  },
  updateInstitutionStock: (id, payload) => {
    return apiClient.put(`/api/v1/institution-stock/${id}`, payload);
  },
  deleteInstitutionStock: (id) => {
    return apiClient.delete(`/api/v1/institution-stock/${id}`);
  },
  getAllInstitutionStock: (payload) => {
    return apiClient.get("/api/v1/institution-stock/admin", payload);
  },
  getAvailableInstitutionStock: (payload) => {
    return apiClient.get("/api/v1/institution-stock/available", payload);
  },
  createInstitutionStock: (payload) => {
    return apiClient.post("/api/v1/institution-stock", payload);
  },
};

export default InstitutionStockService;
