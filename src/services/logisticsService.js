import apiClient from "@/lib/axios";

const logisticsService = {
  /**
   * Creates a new shipment (logistics record).
   * @param {object} payload - The data for the new shipment.
   * e.g., { requirementId: "...", vehicles: [{ vehicleNumber: "UP32AB1234", driverName: "Test", driverContact: "123", loadedAt: "2024-01-01T10:00:00Z", departedAt: "2024-01-01T12:00:00Z" }], shipmentId: "optional-id" }
   */
  createLogistics: (payload) => {
    return apiClient.post("/api/v1/logistics", payload);
  },

  // Add other logistics-related API calls here later (get list, get by ID, update status)
};

export default logisticsService;
