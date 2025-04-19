import { createSlice } from "@reduxjs/toolkit";
import { getMedicines } from "./actions";

const initialState = {
  medicines: [],
};

const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMedicines.fulfilled, (state, action) => {
      const data = action.payload?.data;
      state.medicines = data?.docs;
    });
  },
});

export default medicineSlice.reducer;
