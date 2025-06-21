import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import patientReducer from "./slices/PatientSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
