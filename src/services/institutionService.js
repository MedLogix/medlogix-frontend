import apiClient from "@/lib/axios";

const InstitutionService = {
  getInstitutions: (payload) => {
    return apiClient.get("/api/v1/institution", payload);
  },
  getInstitutionById: (id) => {
    return apiClient.get(`/api/v1/institution/${id}`);
  },
};

export default InstitutionService;
