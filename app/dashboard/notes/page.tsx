"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast"; // Assuming you have react-hot-toast installed
import { createNote } from "@/app/_apis/patient";

// Define the Yup schema based on the target JSON structure
const notesSchema = yup.object().shape({
  // Depression/SI section
  recentSuicideAttempt: yup
    .object()
    .shape({
      value: yup
        .string()
        .oneOf(["yes", "no"])
        .required("Recent suicide attempt is required"),
      details: yup
        .string()
        .when("value", {
          is: "yes",
          then: (schema) =>
            schema.required(
              "Explanation for suicide attempt is required if 'Yes'"
            ),
          otherwise: (schema) =>
            schema
              .notRequired()
              .transform((_, originalValue) =>
                originalValue === "" ? undefined : originalValue
              ), // Make optional and handle empty string
        })
        .nullable(),
    })
    .required(), // Mark the whole object as required

  recentIntentionOfSelfHarm: yup
    .object()
    .shape({
      value: yup
        .string()
        .oneOf(["yes", "no"])
        .required("Recent intention of self harm is required"),
      details: yup
        .string()
        .when("value", {
          is: "yes",
          then: (schema) =>
            schema.required("Explanation for self harm is required if 'Yes'"),
          otherwise: (schema) =>
            schema
              .notRequired()
              .transform((_, originalValue) =>
                originalValue === "" ? undefined : originalValue
              ),
        })
        .nullable(),
    })
    .required(),

  suicidalIdeation: yup
    .object()
    .shape({
      value: yup
        .string()
        .oneOf(["yes", "no"])
        .required("Suicidal ideation status is required"),
      plan: yup
        .string()
        .when("value", {
          is: "yes",
          then: (schema) =>
            schema.required("Plan for suicidal ideation is required if 'Yes'"),
          otherwise: (schema) =>
            schema
              .notRequired()
              .transform((_, originalValue) =>
                originalValue === "" ? undefined : originalValue
              ),
        })
        .nullable(),
      // ********* THIS IS THE CORRECTED LINE *********
      intent: yup.string().oneOf(["yes", "no"]).default("no"), // Now explicitly 'yes' | 'no'
    })
    .required(),

  // Past Diagnosis section - Associated Symptoms (checkboxes)
  sleep: yup.boolean(),
  interest: yup.boolean(),
  guilt: yup.boolean(),
  energy: yup.boolean(),
  concentration: yup.boolean(),
  appetite: yup.boolean(),
  anxious: yup.boolean(),
  irritable: yup.boolean(),
  worthless: yup.boolean(),
  hopeless: yup.boolean(),
  pastDiagnosisSummary: yup
    .string()
    .required("Summary of past diagnosis is required."),

  // Function section
  declineInWorkSchool: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Decline in work/school is required"),
  selfCareDecline: yup
    .string()
    .oneOf(["hygiene", "no"]) // Added 'no' option if no decline
    .required("Self-care decline is required"),
  unintentionalWeightLoss: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Unintentional weight loss is required"),
  functionSummary: yup.string().required("Summary of function is required."),

  // Stressors section
  priorHospitalizationAgreeable: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Hospitalization agreement is required"),
});
// Define the type for the form data based on the schema
type NotesFormData = yup.InferType<typeof notesSchema>;

export default function Notes() {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<NotesFormData>({
    resolver: yupResolver(notesSchema),
    defaultValues: {
      recentSuicideAttempt: { value: "no", details: "" },
      recentIntentionOfSelfHarm: { value: "no", details: "" },
      suicidalIdeation: { value: "no", plan: "", intent: "no" }, // Default intent to "no"
      sleep: false,
      interest: false,
      guilt: false,
      energy: false,
      concentration: false,
      appetite: false,
      anxious: false,
      irritable: false,
      worthless: false,
      hopeless: false,
      pastDiagnosisSummary: "",
      declineInWorkSchool: "no", // Default to 'no'
      selfCareDecline: "no", // Default to 'no' if you add it to RadioGroupItem
      unintentionalWeightLoss: "no", // Default to 'no'
      functionSummary: "",
      priorHospitalizationAgreeable: "no", // Default to 'no'
    },
  });

  const [loading, setLoading] = useState(false);

  const handleCreateNote = async (data: NotesFormData) => {
    setLoading(true);
    console.log(data); // This console.log shows the raw form data

    toast.loading("Creating note...");

    try {
      // Define the keys for associated symptoms that are boolean checkboxes
      const symptomKeys = [
        "sleep",
        "interest",
        "guilt",
        "energy",
        "concentration",
        "appetite",
        "anxious",
        "irritable",
        "worthless",
        "hopeless",
      ];

      // Collect all selected associated symptoms based on their 'true' value
      const selectedSymptoms: string[] = [];
      symptomKeys.forEach((key) => {
        // Check if the property exists in data and its value is true
        if (data[key as keyof NotesFormData] === true) {
          // Capitalize the first letter for better readability in the array
          selectedSymptoms.push(key.charAt(0).toUpperCase() + key.slice(1));
        }
      });

      // Combine symptoms and summary into the past_diagnosis array
      const pastDiagnosisArray = [...selectedSymptoms];
      if (data.pastDiagnosisSummary) {
        pastDiagnosisArray.push(data.pastDiagnosisSummary);
      }

      // Transform form data to match the desired JSON structure
      const transformedData = {
        patient_id: 70, // Hardcoded for now; will be dynamic in a real app
        all_data: {
          recent_suicide_attempt: {
            value: data.recentSuicideAttempt.value,
            details: data.recentSuicideAttempt.details || undefined, // Send undefined if empty
          },
          recent_intention_self_harm: {
            value: data.recentIntentionOfSelfHarm.value,
            details: data.recentIntentionOfSelfHarm.details || undefined,
          },
          suicidal_ideation: {
            value: data.suicidalIdeation.value,
            plan: data.suicidalIdeation.plan || undefined,
            intent: data.suicidalIdeation.intent,
          },
          past_diagnosis: pastDiagnosisArray, // This is the updated line
          function: [data.functionSummary], // Wrap summary in an array
          hospitalization_agreement: data.priorHospitalizationAgreeable,
        },
      };

      console.log(
        "Transformed JSON Data:",
        JSON.stringify(transformedData, null, 2)
      );
      const response = await createNote(transformedData);

      toast.success("Note created successfully!");
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to create note. Please try again."
      );
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Depression/SI:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(handleCreateNote)} className="space-y-8">
            {/* Recent Suicide Attempt */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Recent Suicide Attempt
                </h3>
                <Controller
                  name="recentSuicideAttempt.value"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="suicide-yes" />
                        <Label htmlFor="suicide-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="suicide-no" />
                        <Label htmlFor="suicide-no">No</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.recentSuicideAttempt?.value && (
                  <p className="text-red-500 text-sm">
                    {errors.recentSuicideAttempt.value.message}
                  </p>
                )}
                <div>
                  <Label className="text-sm text-gray-600">
                    If, Yes then Explain..
                  </Label>
                  <Textarea
                    {...register("recentSuicideAttempt.details")}
                    className="mt-2 bg-gray-50 border-none min-h-[80px]"
                    placeholder=""
                  />
                  {errors.recentSuicideAttempt?.details && (
                    <p className="text-red-500 text-sm">
                      {errors.recentSuicideAttempt.details.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Intention Of Self Harm */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Recent Intention Of Self Harm
                </h3>
                <Controller
                  name="recentIntentionOfSelfHarm.value"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
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
                {errors.recentIntentionOfSelfHarm?.value && (
                  <p className="text-red-500 text-sm">
                    {errors.recentIntentionOfSelfHarm.value.message}
                  </p>
                )}
                <div>
                  <Label className="text-sm text-gray-600">
                    If, Yes then Explain..
                  </Label>
                  <Textarea
                    {...register("recentIntentionOfSelfHarm.details")}
                    className="mt-2 bg-gray-50 border-none min-h-[80px]"
                    placeholder=""
                  />
                  {errors.recentIntentionOfSelfHarm?.details && (
                    <p className="text-red-500 text-sm">
                      {errors.recentIntentionOfSelfHarm.details.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Suicidal Ideation */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Suicidal Ideation</h3>
              <Controller
                name="suicidalIdeation.value"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
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
              {errors.suicidalIdeation?.value && (
                <p className="text-red-500 text-sm">
                  {errors.suicidalIdeation.value.message}
                </p>
              )}
              <div>
                <Label className="text-sm text-gray-600">Plan</Label>
                <Textarea
                  {...register("suicidalIdeation.plan")}
                  className="mt-2 bg-gray-50 border-none min-h-[80px]"
                  placeholder=""
                />
                {errors.suicidalIdeation?.plan && (
                  <p className="text-red-500 text-sm">
                    {errors.suicidalIdeation.plan.message}
                  </p>
                )}
              </div>
              {/* Note: suicidal_ideation.intent is set as default in schema and not explicitly collected in UI */}
            </div>

            {/* Past Diagnosis */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Past Diagnosis
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Associated Symptoms Checkboxes (for user reference/input, summarized in textarea) */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">
                    Associated Symptoms (for reference)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: "sleep", label: "Sleep" },
                      { key: "interest", label: "Interest" },
                      { key: "guilt", label: "Guilt" },
                      { key: "energy", label: "Energy" },
                      { key: "concentration", label: "Concentration" },
                      { key: "appetite", label: "Appetite" },
                      { key: "anxious", label: "Anxious" },
                      { key: "irritable", label: "Irritable" },
                      { key: "worthless", label: "Worthless" },
                      { key: "hopeless", label: "Hopeless" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center space-x-2"
                      >
                        <Controller
                          name={item.key as keyof NotesFormData}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={item.key}
                              checked={field.value as boolean}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                          )}
                        />
                        <Label htmlFor={item.key} className="text-sm">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Textarea for Past Diagnosis Summary */}
                <div className="space-y-4">
                  <Label
                    htmlFor="pastDiagnosisSummary"
                    className="text-sm text-gray-600"
                  >
                    Summary of Past Diagnosis (e.g., "hehe")
                  </Label>
                  <Textarea
                    id="pastDiagnosisSummary"
                    {...register("pastDiagnosisSummary")}
                    className="mt-2 bg-gray-50 border-none min-h-[120px]"
                    placeholder="Enter summary of past diagnoses here..."
                  />
                  {errors.pastDiagnosisSummary && (
                    <p className="text-red-500 text-sm">
                      {errors.pastDiagnosisSummary.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Function */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Function</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Decline in Work | School:</Label>
                    <Controller
                      name="declineInWorkSchool"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="work-decline-yes" />
                            <Label htmlFor="work-decline-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="work-decline-no" />
                            <Label htmlFor="work-decline-no">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.declineInWorkSchool && (
                      <p className="text-red-500 text-sm">
                        {errors.declineInWorkSchool.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm">Self Care Decline:</Label>
                    <Controller
                      name="selfCareDecline"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="hygiene"
                              id="self-care-hygiene"
                            />
                            <Label htmlFor="self-care-hygiene">Hygiene</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="self-care-no" />
                            <Label htmlFor="self-care-no">No</Label>{" "}
                            {/* Added 'No' option */}
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.selfCareDecline && (
                      <p className="text-red-500 text-sm">
                        {errors.selfCareDecline.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm">
                      Unintentional Weight Loss:
                    </Label>
                    <Controller
                      name="unintentionalWeightLoss"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="weight-loss-yes" />
                            <Label htmlFor="weight-loss-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="weight-loss-no" />
                            <Label htmlFor="weight-loss-no">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {errors.unintentionalWeightLoss && (
                      <p className="text-red-500 text-sm">
                        {errors.unintentionalWeightLoss.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* New Textarea for Function Summary */}
                <div className="space-y-4">
                  <Label
                    htmlFor="functionSummary"
                    className="text-sm text-gray-600"
                  >
                    Summary of Function (e.g., "hoho")
                  </Label>
                  <Textarea
                    id="functionSummary"
                    {...register("functionSummary")}
                    className="mt-2 bg-gray-50 border-none min-h-[120px]"
                    placeholder="Enter summary of functional issues here..."
                  />
                  {errors.functionSummary && (
                    <p className="text-red-500 text-sm">
                      {errors.functionSummary.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stressors */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Stressors</h3>
              <div>
                <Label className="text-sm">
                  Pt or Guardian Agreeable with Hospitalization:
                </Label>
                <Controller
                  name="priorHospitalizationAgreeable"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4 mt-2"
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
                {errors.priorHospitalizationAgreeable && (
                  <p className="text-red-500 text-sm">
                    {errors.priorHospitalizationAgreeable.message}
                  </p>
                )}
              </div>
            </div>

            {/* Create Note Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
                disabled={loading}
              >
                {loading ? "CREATING..." : "CREATE NOTE"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
