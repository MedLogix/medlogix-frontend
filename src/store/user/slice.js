import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  resumes: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    editUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setResumes(state, action) {
      state.resumes = action.payload;
    },
    removeUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, editUser, removeUser, setResumes } = userSlice.actions;
export default userSlice.reducer;
