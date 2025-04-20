import apiClient from "@/lib/axios";

const RequirementService = {
  createRequirement: (payload) => {
    return apiClient.post("/api/v1/requirements", payload);
  },

  getInstitutionRequirements: (payload) => {
    return apiClient.get("/api/v1/requirements", payload);
  },

  getRequirementById: (requirementId) => {
    return apiClient.get(`/api/v1/requirements/${requirementId}`);
  },

  getWarehouseStockAvailability: (requirementId) => {
    return apiClient.get(`/api/v1/requirements/${requirementId}/stock-availability`);
  },

  approveRequirement: (requirementId) => {
    return apiClient.patch(`/api/v1/requirements/${requirementId}/approve`);
  },
};

export default RequirementService;
