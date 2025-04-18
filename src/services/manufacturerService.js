import apiClient from "@/lib/axios";

const ManufacturerService = {
  getManufacturers: (payload) => {
    return apiClient.get("/api/v1/manufacturer", payload);
  },
  getManufacturerById: (id) => {
    return apiClient.get(`/api/v1/manufacturer/${id}`);
  },
  createManufacturer: (payload) => {
    return apiClient.post("/api/v1/manufacturer", payload);
  },
  updateManufacturer: (id, payload) => {
    return apiClient.put(`/api/v1/manufacturer/${id}`, payload);
  },
  deleteManufacturer: (id) => {
    return apiClient.delete(`/api/v1/manufacturer/${id}`);
  },
};

export default ManufacturerService;
