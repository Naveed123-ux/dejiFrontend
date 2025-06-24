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
import { createSelfCareNote } from "@/app/_apis/patient";

// Define the Yup validation schema for the Selfcare Deficit form
const selfcareDeficitFormSchema = yup.object({
  hygieneNeglect: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for Hygiene Neglect."),
  hygieneNeglectExplanation: yup.string().when("hygieneNeglect", {
    is: "yes",
    then: (schema) =>
      schema
        .required("Explanation is required if Hygiene Neglect is 'Yes'.")
        .min(1, "Explanation cannot be empty."),
    otherwise: (schema) => schema.optional(),
  }),
  unsafeLivingConditions: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for Unsafe Living Conditions."),
  unsafeLivingConditionsExplanation: yup
    .string()
    .when("unsafeLivingConditions", {
      is: "yes",
      then: (schema) =>
        schema
          .required(
            "Explanation is required if Unsafe Living Conditions are 'Yes'."
          )
          .min(1, "Explanation cannot be empty."),
      otherwise: (schema) => schema.optional(),
    }),
  nutritionNeglect: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for Nutrition Neglect / Weight Loss."),
  nutritionNeglectExplanation: yup.string().when("nutritionNeglect", {
    is: "yes",
    then: (schema) =>
      schema
        .required(
          "Explanation (amount lost in lbs/weeks) is required if Nutrition Neglect is 'Yes'."
        )
        .min(1, "Explanation cannot be empty."),
    otherwise: (schema) => schema.optional(),
  }),
  cognitiveOrPhysicalImpairment: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for Cognitive Or Physical Impairment."),
  cognitiveOrPhysicalImpairmentNature: yup
    .string()
    .when("cognitiveOrPhysicalImpairment", {
      is: "yes",
      then: (schema) =>
        schema
          .required(
            "Nature of impairment is required if Cognitive Or Physical Impairment is 'Yes'."
          )
          .min(1, "Nature cannot be empty."),
      otherwise: (schema) => schema.optional(),
    }),
  supportSystemAvailable: yup
    .string()
    .oneOf(["adequate", "inadequate", "none"])
    .required("Please select an option for Support System Available."),
  selfcareInsightIntoIllness: yup
    .string() // Renamed to avoid conflict with psychosis form
    .oneOf(["good", "limited", "none"])
    .required("Please select an option for Insight into Illness."),
  selfcareAgreeableWithHospitalization: yup
    .string() // Renamed to avoid conflict with psychosis form
    .oneOf(["yes", "no"])
    .required("Please select an option for Hospitalization Agreement."),
  selfcareFunctionalImpact: yup
    .string() // Renamed to avoid conflict with psychosis form
    .oneOf(["unable-maintain", "requires-supervision"])
    .required("Please select an option for Functional Impact."),
});

// Infer the TypeScript type from the Yup schema for form values
type SelfcareDeficitFormValues = yup.InferType<
  typeof selfcareDeficitFormSchema
>;

// SelfcareDeficitForm functional component
const SelfcareDeficitForm = ({patientId}:{patientId:number}) => {
  const [loading, setLoading] = useState(false);
  // Initialize useForm hook with Yup resolver and default values
  const {
    register, // Function to register input elements
    handleSubmit, // Function to handle form submission
    control, // Object for Controller components
    reset,
    formState: { errors }, // Object containing validation errors
  } = useForm<SelfcareDeficitFormValues>({
    resolver: yupResolver(selfcareDeficitFormSchema), // Connects Yup schema for validation
    defaultValues: {
      // Set initial values for form fields
      hygieneNeglect: "no",
      hygieneNeglectExplanation: "",
      unsafeLivingConditions: "no",
      unsafeLivingConditionsExplanation: "",
      nutritionNeglect: "no",
      nutritionNeglectExplanation: "",
      cognitiveOrPhysicalImpairment: "no",
      cognitiveOrPhysicalImpairmentNature: "",
      supportSystemAvailable: "none",
      selfcareInsightIntoIllness: "none",
      selfcareAgreeableWithHospitalization: "no",
      selfcareFunctionalImpact: "unable-maintain",
    },
    mode: "onChange", // Validate form fields on every change
  });

  // Define the form submission handler
  const onSubmit = async (data: SelfcareDeficitFormValues) => {
    console.log("Selfcare Deficit Form data submitted:", data);
    setLoading(true);
    const loadingID = toast.loading("Creating note...");

    try {
      const transformedData = {
        patient_id: patientId,
        all_data: {
          type: "Psychosis",
          hygieneNeglect: data.hygieneNeglect,
          hygieneNeglectExplanation: data.hygieneNeglectExplanation,
          unsafeLivingConditions: data.unsafeLivingConditions,
          unsafeLivingConditionsExplanation:
            data.unsafeLivingConditionsExplanation,
          nutritionNeglect: data.nutritionNeglect,
          nutritionNeglectExplanation: data.nutritionNeglectExplanation,
          cognitiveOrPhysicalImpairment: data.cognitiveOrPhysicalImpairment,
          cognitiveOrPhysicalImpairmentNature:
            data.cognitiveOrPhysicalImpairmentNature,
          supportSystemAvailable: data.supportSystemAvailable,
          selfcareInsightIntoIllness: data.selfcareInsightIntoIllness,
          selfcareAgreeableWithHospitalization:
            data.selfcareAgreeableWithHospitalization,
          selfcareFunctionalImpact: data.selfcareFunctionalImpact,
        },
      };

      const response = await createSelfCareNote(transformedData);
      toast.success("Note created successfully!");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to create note. Please try again."
      );
    } finally {
      setLoading(false);
      toast.dismiss(loadingID);
      reset();
    }
    // In a real application, you would send this data to your backend API
  };

  // Placeholder for loading state (assuming it's managed externally)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 p-6 bg-white shadow-md rounded-lg"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
          Selfcare Deficit Assessment
        </h2>
        {/* Section: Selfcare Deficit Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hygiene Neglect */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Hygiene Neglect:</h3>
            <Controller
              name="hygieneNeglect"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4" // Ensures horizontal layout, no wrap, consistent gap
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="hygiene-yes" />
                    <Label htmlFor="hygiene-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="hygiene-no" />
                    <Label htmlFor="hygiene-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.hygieneNeglect && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hygieneNeglect.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If, Yes then Explain..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("hygieneNeglectExplanation")}
                placeholder="Describe the nature of hygiene neglect..."
              />
              {errors.hygieneNeglectExplanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hygieneNeglectExplanation.message}
                </p>
              )}
            </div>
          </div>

          {/* Unsafe Living Conditions */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Unsafe Living Conditions:
            </h3>
            <Controller
              name="unsafeLivingConditions"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="unsafe-yes" />
                    <Label htmlFor="unsafe-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="unsafe-no" />
                    <Label htmlFor="unsafe-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.unsafeLivingConditions && (
              <p className="text-red-500 text-sm mt-1">
                {errors.unsafeLivingConditions.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If, Yes then Explain..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("unsafeLivingConditionsExplanation")}
                placeholder="Describe the unsafe living conditions..."
              />
              {errors.unsafeLivingConditionsExplanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.unsafeLivingConditionsExplanation.message}
                </p>
              )}
            </div>
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Hygiene & Unsafe Living */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Nutrition Neglect / Weight Loss */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Nutrition Neglect / Weight Loss:
            </h3>
            <Controller
              name="nutritionNeglect"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="nutrition-yes" />
                    <Label htmlFor="nutrition-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="nutrition-no" />
                    <Label htmlFor="nutrition-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.nutritionNeglect && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nutritionNeglect.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If yes, amount lost: _____ lbs. in _____ weeks.
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("nutritionNeglectExplanation")}
                placeholder="E.g., '10 lbs in 4 weeks due to poor appetite.'"
              />
              {errors.nutritionNeglectExplanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nutritionNeglectExplanation.message}
                </p>
              )}
            </div>
          </div>

          {/* Cognitive Or Physical Impairment */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Cognitive Or Physical Impairment:
            </h3>
            <Controller
              name="cognitiveOrPhysicalImpairment"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="cognitive-yes" />
                    <Label htmlFor="cognitive-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="cognitive-no" />
                    <Label htmlFor="cognitive-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.cognitiveOrPhysicalImpairment && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cognitiveOrPhysicalImpairment.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">Nature..</Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("cognitiveOrPhysicalImpairmentNature")}
                placeholder="Describe the nature of impairment..."
              />
              {errors.cognitiveOrPhysicalImpairmentNature && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cognitiveOrPhysicalImpairmentNature.message}
                </p>
              )}
            </div>
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Nutrition & Impairment */}
      </div>{" "}
      {/* End of main space-y-6 container */}
      {/* Section: Support & Functional Impact */}
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
          Assessment
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support System Available */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Support System Available:
            </h3>
            <div className="space-y-3">
              {" "}
              {/* This section naturally stacks vertically */}
              <Controller
                name="supportSystemAvailable"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3" // Vertical stacking as per original
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="adequate" id="support-adequate" />
                      <Label htmlFor="support-adequate" className="text-sm">
                        Adequate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="inadequate"
                        id="support-inadequate"
                      />
                      <Label htmlFor="support-inadequate" className="text-sm">
                        Inadequate
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="none" id="support-none" />
                      <Label htmlFor="support-none" className="text-sm">
                        None
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.supportSystemAvailable && (
              <p className="text-red-500 text-sm mt-1">
                {errors.supportSystemAvailable.message}
              </p>
            )}
          </div>

          {/* Insight into Illness (Self-Care specific) */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Insight into Illness:</h3>
            <div className="space-y-3">
              <Controller
                name="selfcareInsightIntoIllness"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3" // Vertical stacking as per original
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="good" id="selfcare-insight-good" />
                      <Label
                        htmlFor="selfcare-insight-good"
                        className="text-sm"
                      >
                        Good
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="limited"
                        id="selfcare-insight-limited"
                      />
                      <Label
                        htmlFor="selfcare-insight-limited"
                        className="text-sm"
                      >
                        Limited
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="none" id="selfcare-insight-none" />
                      <Label
                        htmlFor="selfcare-insight-none"
                        className="text-sm"
                      >
                        None
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.selfcareInsightIntoIllness && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selfcareInsightIntoIllness.message}
              </p>
            )}
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Support System & Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Agreeable With Hospitalization (Self-Care specific) */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Agreeable With Hospitalization:
            </h3>
            <Controller
              name="selfcareAgreeableWithHospitalization"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="selfcare-hospital-yes" />
                    <Label htmlFor="selfcare-hospital-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="selfcare-hospital-no" />
                    <Label htmlFor="selfcare-hospital-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.selfcareAgreeableWithHospitalization && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selfcareAgreeableWithHospitalization.message}
              </p>
            )}
          </div>

          {/* Functional Impact (Self-Care specific) */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Functional Impact:</h3>
            <div className="space-y-3">
              <Controller
                name="selfcareFunctionalImpact"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3" // Vertical stacking as per original
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="unable-maintain"
                        id="unable-maintain"
                      />
                      <Label htmlFor="unable-maintain" className="text-sm">
                        Unable To Maintain Basic Needs
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="requires-supervision"
                        id="requires-supervision"
                      />
                      <Label htmlFor="requires-supervision" className="text-sm">
                        Requires Supervision
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.selfcareFunctionalImpact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selfcareFunctionalImpact.message}
              </p>
            )}
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Hospitalization & Functional Impact */}
      </div>{" "}
      {/* End of Assessment section */}
      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-md transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "CREATING..." : "CREATE NOTE"}
        </Button>
      </div>
    </form>
  );
};

export default SelfcareDeficitForm;
