import SaltService from "@/services/saltService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getSalts = createAsyncThunk("salt/getSalts", async (payload) => {
  try {
    const response = await SaltService.getSalts(payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
