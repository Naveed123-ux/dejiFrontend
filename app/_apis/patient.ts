import { privateApi } from "@/lib/axios";
import { PatientRegistration } from "@/hooks/types/types";
import axios from "axios";

export const patientRegister = async (data: PatientRegistration) => {
  try {
    const response = await privateApi.post("/register-patient", data);
    return response.data;
    console.log("Patient registered successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail || "Failed to register patient"
      );
    }
    throw new Error(
      "An unexpected error occurred while registering the patient"
    );
  }
};
