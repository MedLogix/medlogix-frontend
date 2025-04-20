import apiClient from "@/lib/axios";

const InstitutionStockService = {
  getInstitutionStock: (payload) => {
    return apiClient.get("/api/v1/institution-stock", payload);
  },
  getInstitutionStockById: (id) => {
    return apiClient.get(`/api/v1/institution-stock/${id}`);
  },
};

export default InstitutionStockService;
