export interface SignupFormData {
  fullname: string;
  email: string;
  mobile_number: string;
  dob: string;
  password: string;
  confirmPassword: string;
}
export interface signInSchema {
  email: string;
  password: string;
}

export interface EncryptedData {
  fullname: string;
  race: string;
  phonenumber: string;
  dob: string;
  emergencycontact: string;
  primary_care_provider: string;
  behavioral_health_provider: string;
  status: string;
  case_id: string;
}

export interface PatientRecord {
  id: number;
  insuranceid: string;
  active_duty: boolean;
  veteran: boolean;
  case_id: string;
  registration_date: string;
  admitted_date: string | null;
  documents: string;
  encrypted_data: EncryptedData;
}

export interface Patient {
  admitted: string | null;
  case: string | null;
  status: string | null;
  documents: string | null;
}

export interface PatientRegistration {
  fullname: string;
  dob: string;
  race: string;
  phonenumber: string;
  address: string;
  veteran: "yes" | "no";
  active_duty: "yes" | "no";
  emergencycontact: string;
  primary_care_provider: string;
  insuranceid: string;
  behavioral_health_provider: string;
}
