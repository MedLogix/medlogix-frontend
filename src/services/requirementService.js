import apiClient from "@/lib/axios";

const RequirementService = {
  createRequirement: (payload) => {
    return apiClient.post("/api/v1/requirements", payload);
  },

  getWarehouseRequirements: (payload) => {
    return apiClient.get("/api/v1/requirements/warehouse", payload);
  },

  getInstitutionRequirements: (payload) => {
    return apiClient.get("/api/v1/requirements", payload);
  },

  getRequirementById: (requirementId) => {
    return apiClient.get(`/api/v1/requirements/${requirementId}`);
  },

  approveRequirementItems: (requirementId, payload) => {
    return apiClient.patch(`/api/v1/requirements/${requirementId}/approve`, payload);
  },
};

export default RequirementService;
