import { createSlice } from "@reduxjs/toolkit";
import { getSalts } from "./actions";

const initialState = {
  salts: [],
};

const saltSlice = createSlice({
  name: "salt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSalts.fulfilled, (state, action) => {
      const data = action.payload?.data;
      state.salts = data?.docs;
    });
  },
});

export default saltSlice.reducer;
