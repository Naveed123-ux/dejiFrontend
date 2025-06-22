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
import toast from "react-hot-toast";
import { createNote } from "@/app/_apis/patient";

// Tab configuration
const tabs = [
  { id: "depression-si", label: "Depression/SI", active: true },
  { id: "depression-hi", label: "Depression/HI", active: false },
  { id: "psychosis", label: "Psychosis", active: false },
  { id: "selfcare-deficit", label: "Selfcare Deficit", active: false },
  { id: "alcohol-benzo", label: "Alcohol Benzo", active: false },
];

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
              ),
        })
        .nullable(),
    })
    .required(),

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
      intent: yup.string().oneOf(["yes", "no"]).default("no"),
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
    .oneOf(["hygiene", "no"])
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

type NotesFormData = yup.InferType<typeof notesSchema>;

export default function Notes() {
  const [activeTab, setActiveTab] = useState("depression-si");
  const [loading, setLoading] = useState(false);

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
      suicidalIdeation: { value: "no", plan: "", intent: "no" },
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
      declineInWorkSchool: "no",
      selfCareDecline: "no",
      unintentionalWeightLoss: "no",
      functionSummary: "",
      priorHospitalizationAgreeable: "no",
    },
  });

  const handleCreateNote = async (data: NotesFormData) => {
    setLoading(true);
    toast.loading("Creating note...");

    try {
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

      const selectedSymptoms: string[] = [];
      symptomKeys.forEach((key) => {
        if (data[key as keyof NotesFormData] === true) {
          selectedSymptoms.push(key.charAt(0).toUpperCase() + key.slice(1));
        }
      });

      const pastDiagnosisArray = [...selectedSymptoms];
      if (data.pastDiagnosisSummary) {
        pastDiagnosisArray.push(data.pastDiagnosisSummary);
      }

      const transformedData = {
        patient_id: 70,
        all_data: {
          recent_suicide_attempt: {
            value: data.recentSuicideAttempt.value,
            details: data.recentSuicideAttempt.details || undefined,
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
          past_diagnosis: pastDiagnosisArray,
          function: [data.functionSummary],
          hospitalization_agreement: data.priorHospitalizationAgreeable,
        },
      };

      const response = await createNote(transformedData);
      toast.success("Note created successfully!");
      reset();
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

  const renderDepressionSI = () => (
    <form onSubmit={handleSubmit(handleCreateNote)} className="space-y-8">
      {/* Recent Suicide Attempt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Recent Suicide Attempt</h3>
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
            <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
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
          <h3 className="font-medium text-gray-900">Recent Intention Of Self Harm</h3>
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
            <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
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
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Associated Symptoms (for reference)</h3>
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
                <div key={item.key} className="flex items-center space-x-2">
                  <Controller
                    name={item.key as keyof NotesFormData}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={item.key}
                        checked={field.value as boolean}
                        onCheckedChange={(checked) => field.onChange(checked)}
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

          <div className="space-y-4">
            <Label htmlFor="pastDiagnosisSummary" className="text-sm text-gray-600">
              Summary of Past Diagnosis
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
                      <RadioGroupItem value="hygiene" id="self-care-hygiene" />
                      <Label htmlFor="self-care-hygiene">Hygiene</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="self-care-no" />
                      <Label htmlFor="self-care-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div>
              <Label className="text-sm">Unintentional Weight Loss:</Label>
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
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="functionSummary" className="text-sm text-gray-600">
              Summary of Function
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
          <Label className="text-sm">Pt or Guardian Agreeable with Hospitalization:</Label>
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
        </div>
      </div>

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
  );

  const renderDepressionHI = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Depression/HI:</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Suicide Attempt */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Recent Suicide Attempt</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hi-suicide-yes" />
                <Label htmlFor="hi-suicide-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hi-suicide-no" />
                <Label htmlFor="hi-suicide-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* Recent Intention Of Self Harm */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Recent Intention Of Self Harm</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hi-harm-yes" />
                <Label htmlFor="hi-harm-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hi-harm-no" />
                <Label htmlFor="hi-harm-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>

        {/* Suicidal Ideation */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Suicidal Ideation</h3>
          <RadioGroup className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="hi-ideation-yes" />
              <Label htmlFor="hi-ideation-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="hi-ideation-no" />
              <Label htmlFor="hi-ideation-no">No</Label>
            </div>
          </RadioGroup>
          <div>
            <Label className="text-sm text-gray-600">Plan</Label>
            <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
          </div>
        </div>
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Associated Symptoms */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Associated Symptoms</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Sleep", "Interest", "Guilt", "Energy", 
                "Concentration", "Appetite", "Anxious", "Irritable", 
                "Worthless", "Hopeless"
              ].map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox id={`hi-${symptom.toLowerCase()}`} />
                  <Label htmlFor={`hi-${symptom.toLowerCase()}`} className="text-sm">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Function */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Function</h3>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Decline in Work | School:</Label>
                <RadioGroup className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hi-work-yes" />
                    <Label htmlFor="hi-work-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hi-work-no" />
                    <Label htmlFor="hi-work-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm">Self Care Decline:</Label>
                <RadioGroup className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hygiene" id="hi-hygiene" />
                    <Label htmlFor="hi-hygiene">Hygiene</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hi-hygiene-no" />
                    <Label htmlFor="hi-hygiene-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm">Unintentional Weight Loss:</Label>
                <RadioGroup className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hi-weight-yes" />
                    <Label htmlFor="hi-weight-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hi-weight-no" />
                    <Label htmlFor="hi-weight-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stressors */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Stressors</h3>
        <div>
          <Label className="text-sm">Pt or Guardian Agreeable with Hospitalization:</Label>
          <RadioGroup className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="hi-hospital-yes" />
              <Label htmlFor="hi-hospital-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="hi-hospital-no" />
              <Label htmlFor="hi-hospital-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
          CREATE NOTE
        </Button>
      </div>
    </div>
  );

  const renderPsychosis = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Psychosis :</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Auditory Hallucinations */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Auditory Hallucinations:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="auditory-yes" />
                <Label htmlFor="auditory-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="auditory-no" />
                <Label htmlFor="auditory-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* Visual Hallucinations */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Visual Hallucinations:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="visual-yes" />
                <Label htmlFor="visual-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="visual-no" />
                <Label htmlFor="visual-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paranoid Delusions */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Paranoid Delusions Or Ideas Of Reference:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="paranoid-yes" />
                <Label htmlFor="paranoid-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="paranoid-no" />
                <Label htmlFor="paranoid-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">Details..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* Disorganized Behavior */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Disorganized Behavior Or Speech:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="disorganized-yes" />
                <Label htmlFor="disorganized-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="disorganized-no" />
                <Label htmlFor="disorganized-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">Details..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medication Compliance */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Medication Compliance:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compliant" id="med-compliant" />
                <Label htmlFor="med-compliant" className="text-sm">Compliant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="noncompliant" id="med-noncompliant" />
                <Label htmlFor="med-noncompliant" className="text-sm">Noncompliant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="med-unknown" />
                <Label htmlFor="med-unknown" className="text-sm">Unknown</Label>
              </div>
            </div>
          </div>

          {/* Insight into Illness */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Insight into Illness:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="insight-good" />
                <Label htmlFor="insight-good" className="text-sm">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited" id="insight-limited" />
                <Label htmlFor="insight-limited" className="text-sm">Limited</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="insight-none" />
                <Label htmlFor="insight-none" className="text-sm">None</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agreeable With Hospitalization */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Agreeable With Hospitalization:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="psych-hospital-yes" />
                <Label htmlFor="psych-hospital-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="psych-hospital-no" />
                <Label htmlFor="psych-hospital-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Functional Impact */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Functional Impact:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inability-care" id="inability-care" />
                <Label htmlFor="inability-care" className="text-sm">Inability To Care For Self</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsafe-home" id="unsafe-home" />
                <Label htmlFor="unsafe-home" className="text-sm">Unsafe In Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="threat-others" id="threat-others" />
                <Label htmlFor="threat-others" className="text-sm">Threat To Others</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
          CREATE NOTE
        </Button>
      </div>
    </div>
  );

  const renderSelfcareDeficit = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Selfcare Deficit:</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hygiene Neglect */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Hygiene Neglect:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="hygiene-yes" />
                <Label htmlFor="hygiene-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="hygiene-no" />
                <Label htmlFor="hygiene-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* Unsafe Living Conditions */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Unsafe Living Conditions:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="unsafe-yes" />
                <Label htmlFor="unsafe-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="unsafe-no" />
                <Label htmlFor="unsafe-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nutrition Neglect */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Nutrition Neglect / Weight Loss:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="nutrition-yes" />
                <Label htmlFor="nutrition-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="nutrition-no" />
                <Label htmlFor="nutrition-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If yes, amount lost: _____ lbs. in _____ weeks..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* Cognitive Or Physical Impairment */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Cognitive Or Physical Impairment:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="cognitive-yes" />
                <Label htmlFor="cognitive-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="cognitive-no" />
                <Label htmlFor="cognitive-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">Nature..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support System Available */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Support System Available:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adequate" id="support-adequate" />
                <Label htmlFor="support-adequate" className="text-sm">Adequate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inadequate" id="support-inadequate" />
                <Label htmlFor="support-inadequate" className="text-sm">Inadequate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="support-none" />
                <Label htmlFor="support-none" className="text-sm">None</Label>
              </div>
            </div>
          </div>

          {/* Insight into Illness */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Insight into Illness:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="selfcare-insight-good" />
                <Label htmlFor="selfcare-insight-good" className="text-sm">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited" id="selfcare-insight-limited" />
                <Label htmlFor="selfcare-insight-limited" className="text-sm">Limited</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="selfcare-insight-none" />
                <Label htmlFor="selfcare-insight-none" className="text-sm">None</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agreeable With Hospitalization */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Agreeable With Hospitalization:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="selfcare-hospital-yes" />
                <Label htmlFor="selfcare-hospital-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="selfcare-hospital-no" />
                <Label htmlFor="selfcare-hospital-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Functional Impact */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Functional Impact:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unable-maintain" id="unable-maintain" />
                <Label htmlFor="unable-maintain" className="text-sm">Unable To Maintain Basic Needs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="requires-supervision" id="requires-supervision" />
                <Label htmlFor="requires-supervision" className="text-sm">Requires Supervision</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
          CREATE NOTE
        </Button>
      </div>
    </div>
  );

  const renderAlcoholBenzo = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Alcohol Benzo:</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Use of Alcohol or Benzos */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Recent Use of Alcohol or Benzos:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="alcohol-use-yes" />
                <Label htmlFor="alcohol-use-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="alcohol-use-no" />
                <Label htmlFor="alcohol-use-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* History of Withdrawal Seizures */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">History of Withdrawal Seizures or Delirium Tremens:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="withdrawal-yes" />
                <Label htmlFor="withdrawal-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="withdrawal-no" />
                <Label htmlFor="withdrawal-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signs Of Intoxication */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Signs Of Intoxication / Withdrawal:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="intoxication-yes" />
                <Label htmlFor="intoxication-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="intoxication-no" />
                <Label htmlFor="intoxication-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">Explain symptoms..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>

          {/* Use Impacting Safety */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Use Impacting Safety or Functioning:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="safety-yes" />
                <Label htmlFor="safety-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="safety-no" />
                <Label htmlFor="safety-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">State Examples..</Label>
              <Textarea className="mt-2 bg-gray-50 border-none min-h-[80px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dual Diagnosis */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Dual Diagnosis (Substance + Mental Health):</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="dual-yes" />
                <Label htmlFor="dual-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="dual-no" />
                <Label htmlFor="dual-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Insight into Illness */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Insight into Illness:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="alcohol-insight-good" />
                <Label htmlFor="alcohol-insight-good" className="text-sm">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited" id="alcohol-insight-limited" />
                <Label htmlFor="alcohol-insight-limited" className="text-sm">Limited</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="alcohol-insight-none" />
                <Label htmlFor="alcohol-insight-none" className="text-sm">None</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agreeable With Hospitalization */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Agreeable With Hospitalization Or Detox Admission:</h3>
            <RadioGroup className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="alcohol-hospital-yes" />
                <Label htmlFor="alcohol-hospital-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="alcohol-hospital-no" />
                <Label htmlFor="alcohol-hospital-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Motivated for Detox */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Motivated for Detox / Rehab:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ambivalent" id="motivated-ambivalent" />
                <Label htmlFor="motivated-ambivalent" className="text-sm">Ambivalent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="motivated-yes" />
                <Label htmlFor="motivated-yes" className="text-sm">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="motivated-no" />
                <Label htmlFor="motivated-no" className="text-sm">No</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
          CREATE NOTE
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "depression-si":
        return renderDepressionSI();
      case "depression-hi":
        return renderDepressionHI();
      case "psychosis":
        return renderPsychosis();
      case "selfcare-deficit":
        return renderSelfcareDeficit();
      case "alcohol-benzo":
        return renderAlcoholBenzo();
      default:
        return renderDepressionSI();
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
      </div>

      <Card>
        <CardHeader>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  );
}