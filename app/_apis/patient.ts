import { privateApi } from "@/lib/axios";
import {
  NotesPayload,
  PatientRegistration,
  PsychosisFormSubmissionData,
  SelfcareDeficitFormSubmissionData,
  AlcoholBenzoFormSubmissionData,
} from "@/hooks/types/types";
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

export const createNote = async (data: NotesPayload) => {
  try {
    const response = await privateApi.post("/add-questionaries", data);
    response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Errro");
      throw new Error(error.response?.data?.detail || "error creating note");
    }
    throw new Error("Error creating note");
  }
};
export const createSychosisNote = async (data: PsychosisFormSubmissionData) => {
  try {
    const response = await privateApi.post("/add-questionaries", data);
    response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "error creating note");
    }
    throw new Error("Error creating note");
  }
};
export const createSelfCareNote = async (
  data: SelfcareDeficitFormSubmissionData
) => {
  try {
    const response = await privateApi.post("/add-questionaries", data);
    response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "error creating note");
    }
    throw new Error("Error creating note");
  }
};

export const createAlcoholNote = async (
  data: AlcoholBenzoFormSubmissionData
) => {
  try {
    const response = await privateApi.post("/add-questionaries", data);
    response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail ?? "error creating note");
    }
    throw new Error("Error creating note");
  }
};

export const changePatientStatus = async (insurnaceID: string) => {
  try {
    const response = await privateApi.post(`assign-facility/${insurnaceID}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "accept patient fail");
    }
    throw new Error("accept patient fail");
  }
};
