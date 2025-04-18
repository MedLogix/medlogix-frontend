import { createSlice } from "@reduxjs/toolkit";
import { getManufacturers } from "./actions";

const initialState = {
  manufacturers: [],
};

const manufacturerSlice = createSlice({
  name: "manufacturer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getManufacturers.fulfilled, (state, action) => {
      const data = action.payload?.data;
      state.manufacturers = data?.docs;
    });
  },
});

export default manufacturerSlice.reducer;
