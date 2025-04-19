import MedicineService from "@/services/medicineService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getMedicines = createAsyncThunk("medicine/getMedicines", async (payload) => {
  try {
    const response = await MedicineService.getMedicines(payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
