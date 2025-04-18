import AuthService from "@/services/authService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrentUser = createAsyncThunk("user/getCurrentUser", async () => {
  try {
    const response = await AuthService.getCurrentUser();
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
