import apiClient from "@/lib/axios";

const MedicineService = {
  getMedicines: (payload) => {
    return apiClient.get("/api/v1/medicine", payload);
  },
  getMedicineById: (id) => {
    return apiClient.get(`/api/v1/medicine/${id}`);
  },
  createMedicine: (payload) => {
    return apiClient.post("/api/v1/medicine", payload);
  },
  updateMedicine: (id, payload) => {
    return apiClient.put(`/api/v1/medicine/${id}`, payload);
  },
  deleteMedicine: (id) => {
    return apiClient.delete(`/api/v1/medicine/${id}`);
  },
};

export default MedicineService;
