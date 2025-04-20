import apiClient from "@/lib/axios";

const requirementService = {
  /**
   * Fetches incoming requirements for the logged-in warehouse.
   * @param {object} config - Axios request configuration, including params for pagination, search, filters.
   * e.g., { params: { page: 1, limit: 10, search: "term", filters: '{"status": "pending"}' } }
   */
  getWarehouseRequirements: (config) => {
    return apiClient.get("/api/v1/requirements/warehouse", config);
  },

  /**
   * Fetches a single requirement by its ID.
   * @param {string} requirementId - The ID of the requirement.
   */
  getRequirementById: (requirementId) => {
    return apiClient.get(`/api/v1/requirements/${requirementId}`);
  },

  /**
   * Submits approvals/rejections for requirement items.
   * @param {string} requirementId - The ID of the requirement.
   * @param {object} payload - The data containing the updates.
   * e.g., { medicines: [{ medicineId: "...", status: "approved", approvedQuantity: 10 }, ...] }
   */
  approveRequirementItems: (requirementId, payload) => {
    return apiClient.patch(`/api/v1/requirements/${requirementId}/approve`, payload);
  },

  // Add other requirement-related API calls here later
};

export default requirementService;
