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
  patient_id: number;
  caseId: string;
  name: string;
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

export interface NotesPayload {
  patient_id: number;
  all_data: {
    recent_suicide_attempt: {
      value: "yes" | "no";
      details?: string;
    };
    recent_intention_self_harm: {
      value: "yes" | "no";
      details?: string;
    };
    suicidal_ideation: {
      value: "yes" | "no";
      plan?: string;
      intent: "yes" | "no";
    };
    past_diagnosis: string[];
    function: string[];
    hospitalization_agreement: "yes" | "no";
  };
}

export interface PsychosisFormSubmissionData {
  patient_id: number;
  all_data: {
    type: string;
    agreeableWithHospitalization: "yes" | "no";
    auditoryHallucinations: "yes" | "no";
    auditoryHallucinationsExplanation?: string; // Optional because it's only required if 'yes'
    disorganizedBehavior: "yes" | "no";
    disorganizedBehaviorDetails?: string; // Optional
    functionalImpact: "inability-care" | "unsafe-home" | "threat-others";
    insightIntoIllness: "good" | "limited" | "none";
    medicationCompliance: "compliant" | "noncompliant" | "unknown";
    paranoidDelusions: "yes" | "no";
    paranoidDelusionsDetails?: string; // Optional
    visualHallucinations: "yes" | "no";
    visualHallucinationsExplanation?: string;
  };
}
export interface SelfcareDeficitFormSubmissionData {
  patient_id: number;
  all_data: {
    type: string;
    hygieneNeglect: "yes" | "no";
    hygieneNeglectExplanation?: string;
    unsafeLivingConditions: "yes" | "no";
    unsafeLivingConditionsExplanation?: string;
    nutritionNeglect: "yes" | "no";
    nutritionNeglectExplanation?: string;
    cognitiveOrPhysicalImpairment: "yes" | "no";
    cognitiveOrPhysicalImpairmentNature?: string;
    supportSystemAvailable: "adequate" | "inadequate" | "none";
    selfcareInsightIntoIllness: "good" | "limited" | "none";
    selfcareAgreeableWithHospitalization: "yes" | "no";
    selfcareFunctionalImpact: "unable-maintain" | "requires-supervision";
  };
}

export interface AlcoholBenzoFormSubmissionData {
  patient_id: number;
  all_data: {
    type: string;
    recentUseAlcoholBenzos: "yes" | "no";
    recentUseAlcoholBenzosExplanation?: string;
    historyWithdrawalSeizures: "yes" | "no";
    historyWithdrawalSeizuresExplanation?: string;
    signsIntoxicationWithdrawal: "yes" | "no";
    signsIntoxicationWithdrawalExplanation?: string;
    useImpactingSafety: "yes" | "no";
    useImpactingSafetyExamples?: string;
    dualDiagnosis: "yes" | "no";
    alcoholInsightIntoIllness: "good" | "limited" | "none";
    agreeableWithHospitalizationDetox: "yes" | "no";
    motivatedForDetoxRehab: "ambivalent" | "yes" | "no";
  };
}
