import ManufacturerService from "@/services/manufacturerService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getManufacturers = createAsyncThunk("manufacturer/getManufacturers", async (payload) => {
  try {
    const response = await ManufacturerService.getManufacturers(payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
