"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Import zod
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { createNote } from "@/app/_apis/patient";
import RenderSychosis from "@/components/RenderSychosis";
import SelfcareDeficitForm from "@/components/RenderSelfCare";
import RenderAlcohol from "@/components/RenderAlcohol";
import { useSelector, UseSelector } from "react-redux";

// const RadioGroup = ({ children ,onValueChange}: { children: React.ReactNode ,onValueChange:(e:any)=>void}) => {
//   return <div>{children}</div>;
// };
// const RadioGroupItem = ({value,id})=>{
//   return <div>

//   </div>
// }
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
  const { patientId, caseId, patientName } = useSelector(
    (state: any) => state.currentPatient
  );
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
        patient_id: patientId,
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
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <Label
              htmlFor="pastDiagnosisSummary"
              className="text-sm text-gray-600"
            >
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
      </div>

      {/* Past Diagnosis */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <Label
              htmlFor="pastDiagnosisSummary"
              className="text-sm text-gray-600"
            >
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

  const renderPsychosis = () => {
    return <RenderSychosis patientId={patientId} />;
  };
  const renderSelfcareDeficit = () => {
    return <SelfcareDeficitForm patientId={patientId} />;
  };

  const renderAlcoholBenzo = () => <RenderAlcohol patientId={patientId} />;

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
      {patientId ? (
        <div className="flex flex-col">
          <div className="font-medium text-black">
            SelectedPatient: {patientName}
          </div>
          <div className="font-medium text-black">CaseId: {caseId}</div>
        </div>
      ) : (
        <div>
          <div className="font-medium text-black">No Patient is selected</div>
        </div>
      )}
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
        <CardContent>{renderTabContent()}</CardContent>
      </Card>
    </div>
  );
}
