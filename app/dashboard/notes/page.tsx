"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { createNote } from "@/app/_apis/patient";
import { NotesPayload } from "@/hooks/types/types";

// Validation schema
const notesSchema = yup.object().shape({
  patient_id: yup.number().required("Patient ID is required"),
  recent_suicide_attempt: yup.string().oneOf(["yes", "no"]).required(),
  suicide_attempt_details: yup.string().when("recent_suicide_attempt", {
    is: "yes",
    then: (schema) => schema.required("Details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  recent_intention_self_harm: yup.string().oneOf(["yes", "no"]).required(),
  self_harm_details: yup.string().when("recent_intention_self_harm", {
    is: "yes",
    then: (schema) => schema.required("Details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  suicidal_ideation: yup.string().oneOf(["yes", "no"]).required(),
  suicidal_plan: yup.string().when("suicidal_ideation", {
    is: "yes",
    then: (schema) => schema.required("Plan details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  suicidal_intent: yup.string().oneOf(["yes", "no"]).when("suicidal_ideation", {
    is: "yes",
    then: (schema) => schema.required("Intent is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  past_diagnosis: yup.array().of(yup.string()).min(1, "At least one diagnosis must be selected"),
  function_assessment: yup.array().of(yup.string()).min(1, "At least one function must be selected"),
  hospitalization_agreement: yup.string().oneOf(["yes", "no"]).required(),
});

type NotesFormData = yup.InferType<typeof notesSchema>;

const pastDiagnosisOptions = [
  "Depression",
  "Anxiety Disorder",
  "Bipolar Disorder",
  "PTSD",
  "Schizophrenia",
  "Substance Use Disorder",
  "Eating Disorder",
  "OCD",
  "ADHD",
  "Personality Disorder",
];

const functionOptions = [
  "Work/School Performance",
  "Social Relationships",
  "Family Relationships",
  "Self-Care",
  "Financial Management",
  "Legal Issues",
  "Housing Stability",
  "Transportation",
  "Healthcare Management",
  "Daily Living Skills",
];

export default function Notes() {
  const [activeTab, setActiveTab] = useState("suicide-risk");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<NotesFormData>({
    resolver: yupResolver(notesSchema),
    defaultValues: {
      past_diagnosis: [],
      function_assessment: [],
    },
  });

  const watchSuicideAttempt = watch("recent_suicide_attempt");
  const watchSelfHarm = watch("recent_intention_self_harm");
  const watchSuicidalIdeation = watch("suicidal_ideation");

  const onSubmit = async (data: NotesFormData) => {
    try {
      setLoading(true);
      toast.loading("Saving notes...");

      const payload: NotesPayload = {
        patient_id: data.patient_id,
        all_data: {
          recent_suicide_attempt: {
            value: data.recent_suicide_attempt,
            details: data.suicide_attempt_details,
          },
          recent_intention_self_harm: {
            value: data.recent_intention_self_harm,
            details: data.self_harm_details,
          },
          suicidal_ideation: {
            value: data.suicidal_ideation,
            plan: data.suicidal_plan,
            intent: data.suicidal_intent,
          },
          past_diagnosis: data.past_diagnosis,
          function: data.function_assessment,
          hospitalization_agreement: data.hospitalization_agreement,
        },
      };

      await createNote(payload);
      toast.success("Notes saved successfully");
      reset();
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error(typeof error === "string" ? error : "Failed to save notes");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  const tabs = [
    { id: "suicide-risk", label: "Suicide Risk Assessment", icon: "⚠️" },
    { id: "psychosis", label: "Psychosis Screening", icon: "🧠" },
    { id: "history", label: "Clinical History", icon: "📋" },
    { id: "function", label: "Functional Assessment", icon: "⚡" },
    { id: "treatment", label: "Treatment Planning", icon: "🎯" },
  ];

  const renderSuicideRisk = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Recent Suicide Attempt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Has the patient made a suicide attempt in the past 30 days?
            </Label>
            <Controller
              name="recent_suicide_attempt"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="suicide-attempt-yes" />
                    <Label htmlFor="suicide-attempt-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="suicide-attempt-no" />
                    <Label htmlFor="suicide-attempt-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.recent_suicide_attempt && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recent_suicide_attempt.message}
              </p>
            )}
          </div>

          {watchSuicideAttempt === "yes" && (
            <div>
              <Label htmlFor="suicide_attempt_details">
                Please provide details about the suicide attempt
              </Label>
              <Textarea
                id="suicide_attempt_details"
                {...register("suicide_attempt_details")}
                placeholder="Describe the method, circumstances, and any medical intervention required..."
                className="mt-2"
              />
              {errors.suicide_attempt_details && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.suicide_attempt_details.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Self-Harm Intentions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Has the patient expressed recent intentions of self-harm?
            </Label>
            <Controller
              name="recent_intention_self_harm"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="self-harm-yes" />
                    <Label htmlFor="self-harm-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="self-harm-no" />
                    <Label htmlFor="self-harm-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.recent_intention_self_harm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recent_intention_self_harm.message}
              </p>
            )}
          </div>

          {watchSelfHarm === "yes" && (
            <div>
              <Label htmlFor="self_harm_details">
                Please provide details about the self-harm intentions
              </Label>
              <Textarea
                id="self_harm_details"
                {...register("self_harm_details")}
                placeholder="Describe the nature of self-harm intentions, frequency, and triggers..."
                className="mt-2"
              />
              {errors.self_harm_details && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.self_harm_details.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Suicidal Ideation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Is the patient currently experiencing suicidal ideation?
            </Label>
            <Controller
              name="suicidal_ideation"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="ideation-yes" />
                    <Label htmlFor="ideation-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="ideation-no" />
                    <Label htmlFor="ideation-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.suicidal_ideation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.suicidal_ideation.message}
              </p>
            )}
          </div>

          {watchSuicidalIdeation === "yes" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="suicidal_plan">
                  Does the patient have a specific plan?
                </Label>
                <Textarea
                  id="suicidal_plan"
                  {...register("suicidal_plan")}
                  placeholder="Describe any specific plans, methods, or preparations..."
                  className="mt-2"
                />
                {errors.suicidal_plan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.suicidal_plan.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Does the patient have intent to act on these thoughts?
                </Label>
                <Controller
                  name="suicidal_intent"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="intent-yes" />
                        <Label htmlFor="intent-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="intent-no" />
                        <Label htmlFor="intent-no">No</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.suicidal_intent && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.suicidal_intent.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPsychosis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Psychosis Screening Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Hallucinations</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="auditory-hallucinations" />
                  <Label htmlFor="auditory-hallucinations" className="text-sm">
                    Auditory hallucinations (hearing voices)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="visual-hallucinations" />
                  <Label htmlFor="visual-hallucinations" className="text-sm">
                    Visual hallucinations (seeing things)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tactile-hallucinations" />
                  <Label htmlFor="tactile-hallucinations" className="text-sm">
                    Tactile hallucinations (feeling things)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="olfactory-hallucinations" />
                  <Label htmlFor="olfactory-hallucinations" className="text-sm">
                    Olfactory hallucinations (smelling things)
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Delusions</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="persecution-delusions" />
                  <Label htmlFor="persecution-delusions" className="text-sm">
                    Persecutory delusions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="grandiose-delusions" />
                  <Label htmlFor="grandiose-delusions" className="text-sm">
                    Grandiose delusions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reference-delusions" />
                  <Label htmlFor="reference-delusions" className="text-sm">
                    Delusions of reference
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="control-delusions" />
                  <Label htmlFor="control-delusions" className="text-sm">
                    Delusions of control
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Thought Disorders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="thought-insertion" />
                <Label htmlFor="thought-insertion" className="text-sm">
                  Thought insertion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="thought-withdrawal" />
                <Label htmlFor="thought-withdrawal" className="text-sm">
                  Thought withdrawal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="thought-broadcasting" />
                <Label htmlFor="thought-broadcasting" className="text-sm">
                  Thought broadcasting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="disorganized-thinking" />
                <Label htmlFor="disorganized-thinking" className="text-sm">
                  Disorganized thinking
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="psychosis-details">Additional Notes</Label>
            <Textarea
              id="psychosis-details"
              placeholder="Describe any additional psychotic symptoms, onset, duration, and severity..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Past Psychiatric Diagnoses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Select all applicable past diagnoses:
            </Label>
            <Controller
              name="past_diagnosis"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pastDiagnosisOptions.map((diagnosis) => (
                    <div key={diagnosis} className="flex items-center space-x-2">
                      <Checkbox
                        id={`diagnosis-${diagnosis}`}
                        checked={field.value?.includes(diagnosis)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), diagnosis]);
                          } else {
                            field.onChange(
                              field.value?.filter((item) => item !== diagnosis)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`diagnosis-${diagnosis}`}
                        className="text-sm"
                      >
                        {diagnosis}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.past_diagnosis && (
              <p className="text-red-500 text-sm">
                {errors.past_diagnosis.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Treatment History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previous-medications">Previous Medications</Label>
            <Textarea
              id="previous-medications"
              placeholder="List previous psychiatric medications, dosages, and patient response..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="previous-therapy">Previous Therapy</Label>
            <Textarea
              id="previous-therapy"
              placeholder="Describe previous therapy experiences, types, and outcomes..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hospitalizations">Previous Hospitalizations</Label>
            <Textarea
              id="hospitalizations"
              placeholder="List previous psychiatric hospitalizations, dates, and reasons..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFunction = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Functional Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              Select areas where the patient is experiencing difficulties:
            </Label>
            <Controller
              name="function_assessment"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {functionOptions.map((func) => (
                    <div key={func} className="flex items-center space-x-2">
                      <Checkbox
                        id={`function-${func}`}
                        checked={field.value?.includes(func)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), func]);
                          } else {
                            field.onChange(
                              field.value?.filter((item) => item !== func)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`function-${func}`} className="text-sm">
                        {func}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.function_assessment && (
              <p className="text-red-500 text-sm">
                {errors.function_assessment.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Support System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="family-support">Family Support</Label>
            <Textarea
              id="family-support"
              placeholder="Describe family relationships and support available..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="social-support">Social Support</Label>
            <Textarea
              id="social-support"
              placeholder="Describe friendships, social connections, and community involvement..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTreatment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Hospitalization Agreement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Does the patient agree to voluntary hospitalization if recommended?
            </Label>
            <Controller
              name="hospitalization_agreement"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hospitalization-yes" />
                    <Label htmlFor="hospitalization-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hospitalization-no" />
                    <Label htmlFor="hospitalization-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.hospitalization_agreement && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hospitalization_agreement.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Treatment Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="medication-recommendations">
              Medication Recommendations
            </Label>
            <Textarea
              id="medication-recommendations"
              placeholder="Recommend specific medications, dosages, and monitoring requirements..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="therapy-recommendations">
              Therapy Recommendations
            </Label>
            <Textarea
              id="therapy-recommendations"
              placeholder="Recommend specific therapy types, frequency, and goals..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="follow-up-plan">Follow-up Plan</Label>
            <Textarea
              id="follow-up-plan"
              placeholder="Describe follow-up schedule, monitoring plan, and next steps..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "suicide-risk":
        return renderSuicideRisk();
      case "psychosis":
        return renderPsychosis();
      case "history":
        return renderHistory();
      case "function":
        return renderFunction();
      case "treatment":
        return renderTreatment();
      default:
        return renderSuicideRisk();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Clinical Notes & Assessment
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient ID Input */}
            <Card>
              <CardContent className="pt-6">
                <div className="max-w-xs">
                  <Label htmlFor="patient_id">Patient ID</Label>
                  <Input
                    id="patient_id"
                    type="number"
                    placeholder="Enter patient ID"
                    {...register("patient_id", { valueAsNumber: true })}
                    className="mt-2"
                  />
                  {errors.patient_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.patient_id.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                        Active
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {loading ? "Saving..." : "Save Assessment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}