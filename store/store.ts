import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import patientReducer from "./slices/PatientSlice";
import currentPatientReducer from "./slices/CurrentPatient";
import referralPatientSlice from "./slices/RefferalSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    currentPatient: currentPatientReducer,
    referralPatient: referralPatientSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
