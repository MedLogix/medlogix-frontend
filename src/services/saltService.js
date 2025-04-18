import apiClient from "@/lib/axios";

const SaltService = {
  getSalts: (payload) => {
    return apiClient.get("/api/v1/salt", payload);
  },
  getSaltById: (id) => {
    return apiClient.get(`/api/v1/salt/${id}`);
  },
  createSalt: (payload) => {
    return apiClient.post("/api/v1/salt", payload);
  },
  updateSalt: (id, payload) => {
    return apiClient.put(`/api/v1/salt/${id}`, payload);
  },
  deleteSalt: (id) => {
    return apiClient.delete(`/api/v1/salt/${id}`);
  },
};

export default SaltService;
