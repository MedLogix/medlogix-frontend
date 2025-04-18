import { configureStore } from "@reduxjs/toolkit";
import manufacturerReducer from "./manufacturer/slice";
import saltReducer from "./salt/slice";
import userReducer from "./user/slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    manufacturer: manufacturerReducer,
    salt: saltReducer,
  },
});
