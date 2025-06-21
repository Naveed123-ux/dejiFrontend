import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PatientRecord } from "@/hooks/types/types";
import { privateApi } from "@/lib/axios";
import { Patient } from "@/hooks/types/types";
import toast from "react-hot-toast";

// patientsSlice.ts
let toastingId: string | null = null;
export const fetchPatients = createAsyncThunk<
  Patient[],
  void,
  { rejectValue: string }
>("patients/fetchPatients", async (_, { rejectWithValue }) => {
  try {
    const res = await privateApi.get<PatientRecord[]>("");
    return res.data.map((patient) => ({
      admitted: patient.admitted_date,
      documents: patient.documents,
      status: patient.encrypted_data.status,
      case: `ID: ${patient.case_id}`,
    }));
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.detail || "Failed to fetch patients"
    );
  }
});

const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    data: [] as Patient[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
        toastingId = toast.loading("Loading patients...");
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        toast.success("Patients loaded successfully");
        if (toastingId) {
          toast.dismiss(toastingId);
          toastingId = null;
        }
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        if (toastingId) {
          toast.dismiss(toastingId);
          toastingId = null;
        }
        const errorMessage =
          typeof action.payload === "string"
            ? action.payload
            : action.error?.message ?? "Failed to fetch patients";

        state.error = errorMessage;
        toast.error(errorMessage);
      });
  },
});
export default patientsSlice.reducer;
