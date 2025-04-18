import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser } from "./actions";

const initialState = {
  user: null,
  userRole: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.userRole = null;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.userRole = action.payload.userRole;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      const data = action.payload?.data;
      state.user = data?.user;
      state.userRole = data?.userRole;
    });
  },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
