import apiClient from "@/lib/axios";

const InstitutionService = {
  getInstitutions: (payload) => {
    return apiClient.get("/api/v1/institution", payload);
  },
  getInstitutionById: (id) => {
    return apiClient.get(`/api/v1/institution/${id}`);
  },
  approveInstitution: (id) => {
    return apiClient.post(`/api/v1/institution/${id}/approve`);
  },
  rejectInstitution: (id, payload) => {
    return apiClient.post(`/api/v1/institution/${id}/reject`, payload);
  },
};

export default InstitutionService;
