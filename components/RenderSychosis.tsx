"use client"; // This component needs to be a client component for hooks and interactions
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
import { createSychosisNote } from "@/app/_apis/patient";

const psychosisFormSchema = yup.object({
  auditoryHallucinations: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for auditory hallucinations."),
  auditoryHallucinationsExplanation: yup
    .string()
    .when("auditoryHallucinations", {
      is: "yes",
      then: (schema) =>
        schema
          .required(
            "Explanation is required if auditory hallucinations are 'Yes'."
          )
          .min(1, "Explanation cannot be empty."),
      otherwise: (schema) => schema.optional(),
    }),
  visualHallucinations: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for visual hallucinations."),
  visualHallucinationsExplanation: yup.string().when("visualHallucinations", {
    is: "yes",
    then: (schema) =>
      schema
        .required("Explanation is required if visual hallucinations are 'Yes'.")
        .min(1, "Explanation cannot be empty."),
    otherwise: (schema) => schema.optional(),
  }),
  paranoidDelusions: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for paranoid delusions."),
  paranoidDelusionsDetails: yup.string().when("paranoidDelusions", {
    is: "yes",
    then: (schema) =>
      schema
        .required("Details are required if paranoid delusions are 'Yes'.")
        .min(1, "Details cannot be empty."),
    otherwise: (schema) => schema.optional(),
  }),
  disorganizedBehavior: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for disorganized behavior."),
  disorganizedBehaviorDetails: yup.string().when("disorganizedBehavior", {
    is: "yes",
    then: (schema) =>
      schema
        .required("Details are required if disorganized behavior is 'Yes'.")
        .min(1, "Details cannot be empty."),
    otherwise: (schema) => schema.optional(),
  }),
  medicationCompliance: yup
    .string()
    .oneOf(["compliant", "noncompliant", "unknown"])
    .required("Please select an option for medication compliance."),
  insightIntoIllness: yup
    .string()
    .oneOf(["good", "limited", "none"])
    .required("Please select an option for insight into illness."),
  agreeableWithHospitalization: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for hospitalization agreement."),
  functionalImpact: yup
    .string()
    .oneOf(["inability-care", "unsafe-home", "threat-others"])
    .required("Please select an option for functional impact."),
});

// Infer the TypeScript type from the Yup schema
type PsychosisFormValues = yup.InferType<typeof psychosisFormSchema>;

// Define the React functional component
const RenderSychosis = ({ patientId }: { patientId: number }) => {
  // Initialize useForm hook with Yup resolver and default values
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control, // Destructure 'control' for Controller
    formState: { errors },
  } = useForm<PsychosisFormValues>({
    resolver: yupResolver(psychosisFormSchema), // Use yupResolver
    defaultValues: {
      auditoryHallucinations: "no",
      auditoryHallucinationsExplanation: "",
      visualHallucinations: "no",
      visualHallucinationsExplanation: "",
      paranoidDelusions: "no",
      paranoidDelusionsDetails: "",
      disorganizedBehavior: "no",
      disorganizedBehaviorDetails: "",
      medicationCompliance: "unknown",
      insightIntoIllness: "none",
      agreeableWithHospitalization: "no",
      functionalImpact: "inability-care",
    },
    mode: "onChange", // Validate form fields on every change for immediate feedback
  });

  // Define the form submission handler
  const onSubmit = async (data: PsychosisFormValues) => {
    setLoading(true);
    const loadingID = toast.loading("Creating note...");

    try {
      const transformedData = {
        patient_id: patientId,
        all_data: {
          type: "Psychosis",
          agreeableWithHospitalization: data.agreeableWithHospitalization,
          auditoryHallucinations: data.auditoryHallucinations,
          auditoryHallucinationsExplanation:
            data.auditoryHallucinationsExplanation,
          disorganizedBehavior: data.disorganizedBehavior,
          disorganizedBehaviorDetails: data.disorganizedBehaviorDetails,
          functionalImpact: data.functionalImpact,
          insightIntoIllness: data.insightIntoIllness,
          medicationCompliance: data.medicationCompliance,
          paranoidDelusions: data.paranoidDelusions,
          paranoidDelusionsDetails: data.paranoidDelusionsDetails,
          visualHallucinations: data.visualHallucinations,
          visualHallucinationsExplanation: data.visualHallucinationsExplanation,
        },
      };

      const response = await createSychosisNote(transformedData);
      toast.success("Note created successfully!");
    } catch (error) {
      console.error("Error creating note:", error);
      let errorMessage = "Failed to create note. Please try again.";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      toast.dismiss(loadingID);
      reset();
    }
  };

  return (
    // The main form element, connected to React Hook Form's handleSubmit
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Psychosis :</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Auditory Hallucinations Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Auditory Hallucinations:
            </h3>
            <Controller
              name="auditoryHallucinations"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="auditory-yes" />
                    <Label htmlFor="auditory-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="auditory-no" />
                    <Label htmlFor="auditory-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.auditoryHallucinations && (
              <p className="text-red-500 text-sm">
                {errors.auditoryHallucinations.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If, Yes then Explain..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px]"
                {...register("auditoryHallucinationsExplanation")}
              />
              {errors.auditoryHallucinationsExplanation && (
                <p className="text-red-500 text-sm">
                  {errors.auditoryHallucinationsExplanation.message}
                </p>
              )}
            </div>
          </div>

          {/* Visual Hallucinations Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Visual Hallucinations:
            </h3>
            <Controller
              name="visualHallucinations"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="visual-yes" />
                    <Label htmlFor="visual-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="visual-no" />
                    <Label htmlFor="visual-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.visualHallucinations && (
              <p className="text-red-500 text-sm">
                {errors.visualHallucinations.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If, Yes then Explain..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px]"
                {...register("visualHallucinationsExplanation")}
              />
              {errors.visualHallucinationsExplanation && (
                <p className="text-red-500 text-sm">
                  {errors.visualHallucinationsExplanation.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paranoid Delusions Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Paranoid Delusions Or Ideas Of Reference:
            </h3>
            <Controller
              name="paranoidDelusions"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="paranoid-yes" />
                    <Label htmlFor="paranoid-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="paranoid-no" />
                    <Label htmlFor="paranoid-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.paranoidDelusions && (
              <p className="text-red-500 text-sm">
                {errors.paranoidDelusions.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">Details..</Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px]"
                {...register("paranoidDelusionsDetails")}
              />
              {errors.paranoidDelusionsDetails && (
                <p className="text-red-500 text-sm">
                  {errors.paranoidDelusionsDetails.message}
                </p>
              )}
            </div>
          </div>

          {/* Disorganized Behavior Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Disorganized Behavior Or Speech:
            </h3>
            <Controller
              name="disorganizedBehavior"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="disorganized-yes" />
                    <Label htmlFor="disorganized-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="disorganized-no" />
                    <Label htmlFor="disorganized-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.disorganizedBehavior && (
              <p className="text-red-500 text-sm">
                {errors.disorganizedBehavior.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">Details..</Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px]"
                {...register("disorganizedBehaviorDetails")}
              />
              {errors.disorganizedBehaviorDetails && (
                <p className="text-red-500 text-sm">
                  {errors.disorganizedBehaviorDetails.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Past Diagnosis Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medication Compliance Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Medication Compliance:
            </h3>
            <div className="space-y-3">
              <Controller
                name="medicationCompliance"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-row flex-nowrap gap-4"
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="compliant" id="med-compliant" />
                      <Label htmlFor="med-compliant" className="text-sm">
                        Compliant
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="noncompliant"
                        id="med-noncompliant"
                      />
                      <Label htmlFor="med-noncompliant" className="text-sm">
                        Noncompliant
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="unknown" id="med-unknown" />
                      <Label htmlFor="med-unknown" className="text-sm">
                        Unknown
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.medicationCompliance && (
              <p className="text-red-500 text-sm">
                {errors.medicationCompliance.message}
              </p>
            )}
          </div>

          {/* Insight into Illness Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Insight into Illness:</h3>
            <div className="space-y-3">
              <Controller
                name="insightIntoIllness"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-row flex-nowrap gap-4"
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="good" id="insight-good" />
                      <Label htmlFor="insight-good" className="text-sm">
                        Good
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="limited" id="insight-limited" />
                      <Label htmlFor="insight-limited" className="text-sm">
                        Limited
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="none" id="insight-none" />
                      <Label htmlFor="insight-none" className="text-sm">
                        None
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.insightIntoIllness && (
              <p className="text-red-500 text-sm">
                {errors.insightIntoIllness.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agreeable With Hospitalization Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Agreeable With Hospitalization:
            </h3>
            <Controller
              name="agreeableWithHospitalization"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="psych-hospital-yes" />
                    <Label htmlFor="psych-hospital-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="psych-hospital-no" />
                    <Label htmlFor="psych-hospital-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.agreeableWithHospitalization && (
              <p className="text-red-500 text-sm">
                {errors.agreeableWithHospitalization.message}
              </p>
            )}
          </div>

          {/* Functional Impact Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Functional Impact:</h3>
            <div className="space-y-3">
              <Controller
                name="functionalImpact"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3" // Retained space-y-3 for vertical stacking
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="inability-care"
                        id="inability-care"
                      />
                      <Label htmlFor="inability-care" className="text-sm">
                        Inability To Care For Self
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="unsafe-home" id="unsafe-home" />
                      <Label htmlFor="unsafe-home" className="text-sm">
                        Unsafe In Home
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="threat-others"
                        id="threat-others"
                      />
                      <Label htmlFor="threat-others" className="text-sm">
                        Threat To Others
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.functionalImpact && (
              <p className="text-red-500 text-sm">
                {errors.functionalImpact.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
          type="submit"
          disabled={loading}
        >
          CREATE NOTE
        </Button>
      </div>
    </form>
  );
};

export default RenderSychosis;
