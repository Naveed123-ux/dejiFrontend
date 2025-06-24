import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the selected patient data
export interface SelectedPatientState {
  patientId: number | null;
  caseId: string | null;
  patientName: string | null;
}

const initialState: SelectedPatientState = {
  patientId: null,
  caseId: null,
  patientName: null,
};

const currentPatientSlice = createSlice({
  name: "currentPatient",
  initialState,
  reducers: {
    // Action to set the selected patient details
    selectPatient: (
      state,
      action: PayloadAction<{
        patientId: number;
        caseId: string;
        patientName: string;
      }>
    ) => {
      state.patientId = action.payload.patientId;
      state.caseId = action.payload.caseId;
      state.patientName = action.payload.patientName;
    },
    // Action to clear the selected patient details (when navigating back)
    clearSelectedPatient: (state) => {
      state.patientId = null;
      state.caseId = null;
      state.patientName = null;
    },
  },
});

export const { selectPatient, clearSelectedPatient } =
  currentPatientSlice.actions;
export default currentPatientSlice.reducer;
