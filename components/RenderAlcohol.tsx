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
import { createAlcoholNote } from "@/app/_apis/patient";
const alcoholBenzoFormSchema = yup.object({
  recentUseAlcoholBenzos: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for recent alcohol/benzo use."),
  recentUseAlcoholBenzosExplanation: yup
    .string()
    .when("recentUseAlcoholBenzos", {
      is: "yes",
      then: (schema) =>
        schema
          .required("Explanation is required if recent use is 'Yes'.")
          .min(1, "Explanation cannot be empty."),
      otherwise: (schema) => schema.optional(),
    }),
  historyWithdrawalSeizures: yup
    .string()
    .oneOf(["yes", "no"])
    .required(
      "Please select an option for history of withdrawal seizures/DTs."
    ),
  historyWithdrawalSeizuresExplanation: yup
    .string()
    .when("historyWithdrawalSeizures", {
      is: "yes",
      then: (schema) =>
        schema
          .required(
            "Explanation is required if history of withdrawal seizures/DTs is 'Yes'."
          )
          .min(1, "Explanation cannot be empty."),
      otherwise: (schema) => schema.optional(),
    }),
  signsIntoxicationWithdrawal: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for signs of intoxication/withdrawal."),
  signsIntoxicationWithdrawalExplanation: yup
    .string()
    .when("signsIntoxicationWithdrawal", {
      is: "yes",
      then: (schema) =>
        schema
          .required("Explanation of symptoms is required if signs are 'Yes'.")
          .min(1, "Explanation cannot be empty."),
      otherwise: (schema) => schema.optional(),
    }),
  useImpactingSafety: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for use impacting safety/functioning."),
  useImpactingSafetyExamples: yup.string().when("useImpactingSafety", {
    is: "yes",
    then: (schema) =>
      schema
        .required(
          "Examples are required if use is impacting safety/functioning is 'Yes'."
        )
        .min(1, "Examples cannot be empty."),
    otherwise: (schema) => schema.optional(),
  }),
  dualDiagnosis: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Please select an option for dual diagnosis."),
  alcoholInsightIntoIllness: yup
    .string() // Renamed to avoid general conflict
    .oneOf(["good", "limited", "none"])
    .required("Please select an option for insight into illness."),
  agreeableWithHospitalizationDetox: yup
    .string()
    .oneOf(["yes", "no"])
    .required(
      "Please select an option for agreeable with hospitalization/detox admission."
    ),
  motivatedForDetoxRehab: yup
    .string()
    .oneOf(["ambivalent", "yes", "no"])
    .required("Please select an option for motivation for detox/rehab."),
});

// Infer the TypeScript type from the Yup schema for form values
type AlcoholBenzoFormValues = yup.InferType<typeof alcoholBenzoFormSchema>;

// AlcoholBenzoForm functional component
const AlcoholBenzoForm = ({ patientId }: { patientId: number }) => {
  const [loading, setLoading] = useState(false);
  const {
    register, // Function to register input elements
    handleSubmit, // Function to handle form submission
    control,
    reset,
    formState: { errors }, // Object containing validation errors
  } = useForm<AlcoholBenzoFormValues>({
    resolver: yupResolver(alcoholBenzoFormSchema), // Connects Yup schema for validation
    defaultValues: {
      // Set initial values for form fields
      recentUseAlcoholBenzos: "no",
      recentUseAlcoholBenzosExplanation: "",
      historyWithdrawalSeizures: "no",
      historyWithdrawalSeizuresExplanation: "",
      signsIntoxicationWithdrawal: "no",
      signsIntoxicationWithdrawalExplanation: "",
      useImpactingSafety: "no",
      useImpactingSafetyExamples: "",
      dualDiagnosis: "no",
      alcoholInsightIntoIllness: "none",
      agreeableWithHospitalizationDetox: "no",
      motivatedForDetoxRehab: "ambivalent",
    },
    mode: "onChange", // Validate form fields on every change
  });

  // Define the form submission handler
  const onSubmit = async (data: AlcoholBenzoFormValues) => {
    console.log("Alcohol Benzo Form data submitted:", data);
    setLoading(true);
    const loadingID = toast.loading("Creating note...");

    try {
      const transformedData = {
        patient_id: patientId,
        all_data: {
          type: "Psychosis",
          recentUseAlcoholBenzos: data.recentUseAlcoholBenzos,
          recentUseAlcoholBenzosExplanation:
            data.recentUseAlcoholBenzosExplanation,
          historyWithdrawalSeizures: data.historyWithdrawalSeizures,
          historyWithdrawalSeizuresExplanation:
            data.historyWithdrawalSeizuresExplanation,
          signsIntoxicationWithdrawal: data.signsIntoxicationWithdrawal,
          signsIntoxicationWithdrawalExplanation:
            data.historyWithdrawalSeizuresExplanation,
          useImpactingSafety: data.useImpactingSafety,
          useImpactingSafetyExamples: data.useImpactingSafetyExamples,
          dualDiagnosis: data.dualDiagnosis,
          alcoholInsightIntoIllness: data.alcoholInsightIntoIllness,
          agreeableWithHospitalizationDetox:
            data.agreeableWithHospitalizationDetox,
          motivatedForDetoxRehab: data.motivatedForDetoxRehab,
        },
      };

      const response = await createAlcoholNote(transformedData);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 p-6 bg-white shadow-md rounded-lg"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
          Alcohol / Benzo Assessment
        </h2>
        {/* Section: Alcohol Benzo Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Use of Alcohol or Benzos */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Recent Use of Alcohol or Benzos:
            </h3>
            <Controller
              name="recentUseAlcoholBenzos"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4" // Ensures horizontal layout, no wrap, consistent gap
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="alcohol-use-yes" />
                    <Label htmlFor="alcohol-use-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="alcohol-use-no" />
                    <Label htmlFor="alcohol-use-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.recentUseAlcoholBenzos && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recentUseAlcoholBenzos.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If, Yes then Explain..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("recentUseAlcoholBenzosExplanation")}
                placeholder="Describe recent usage details..."
              />
              {errors.recentUseAlcoholBenzosExplanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recentUseAlcoholBenzosExplanation.message}
                </p>
              )}
            </div>
          </div>

          {/* History of Withdrawal Seizures */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              History of Withdrawal Seizures or Delirium Tremens:
            </h3>
            <Controller
              name="historyWithdrawalSeizures"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="withdrawal-yes" />
                    <Label htmlFor="withdrawal-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="withdrawal-no" />
                    <Label htmlFor="withdrawal-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.historyWithdrawalSeizures && (
              <p className="text-red-500 text-sm mt-1">
                {errors.historyWithdrawalSeizures.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                If, Yes then Explain..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("historyWithdrawalSeizuresExplanation")}
                placeholder="Describe history of seizures or DTs..."
              />
              {errors.historyWithdrawalSeizuresExplanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.historyWithdrawalSeizuresExplanation.message}
                </p>
              )}
            </div>
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Recent Use & History Withdrawal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Signs Of Intoxication / Withdrawal */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Signs Of Intoxication / Withdrawal:
            </h3>
            <Controller
              name="signsIntoxicationWithdrawal"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="intoxication-yes" />
                    <Label htmlFor="intoxication-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="intoxication-no" />
                    <Label htmlFor="intoxication-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.signsIntoxicationWithdrawal && (
              <p className="text-red-500 text-sm mt-1">
                {errors.signsIntoxicationWithdrawal.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">
                Explain symptoms..
              </Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("signsIntoxicationWithdrawalExplanation")}
                placeholder="Describe observed symptoms..."
              />
              {errors.signsIntoxicationWithdrawalExplanation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.signsIntoxicationWithdrawalExplanation.message}
                </p>
              )}
            </div>
          </div>

          {/* Use Impacting Safety or Functioning */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Use Impacting Safety or Functioning:
            </h3>
            <Controller
              name="useImpactingSafety"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="safety-yes" />
                    <Label htmlFor="safety-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="safety-no" />
                    <Label htmlFor="safety-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.useImpactingSafety && (
              <p className="text-red-500 text-sm mt-1">
                {errors.useImpactingSafety.message}
              </p>
            )}
            <div>
              <Label className="text-sm text-gray-600">State Examples..</Label>
              <Textarea
                className="mt-2 bg-gray-50 border-none min-h-[80px] rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("useImpactingSafetyExamples")}
                placeholder="Provide examples of safety/functioning impact..."
              />
              {errors.useImpactingSafetyExamples && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.useImpactingSafetyExamples.message}
                </p>
              )}
            </div>
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Intoxication & Safety Impact */}
      </div>{" "}
      {/* End of main space-y-6 container */}
      {/* Section: Past Diagnosis & Motivation */}
      <div className="space-y-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
          Past Diagnosis & Motivation
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dual Diagnosis */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Dual Diagnosis (Substance + Mental Health):
            </h3>
            <Controller
              name="dualDiagnosis"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="dual-yes" />
                    <Label htmlFor="dual-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="dual-no" />
                    <Label htmlFor="dual-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.dualDiagnosis && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dualDiagnosis.message}
              </p>
            )}
          </div>

          {/* Insight into Illness (Alcohol/Benzo specific) */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Insight into Illness:</h3>
            <div className="space-y-3">
              <Controller
                name="alcoholInsightIntoIllness"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3" // Vertical stacking as per original
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="good" id="alcohol-insight-good" />
                      <Label htmlFor="alcohol-insight-good" className="text-sm">
                        Good
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="limited"
                        id="alcohol-insight-limited"
                      />
                      <Label
                        htmlFor="alcohol-insight-limited"
                        className="text-sm"
                      >
                        Limited
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="none" id="alcohol-insight-none" />
                      <Label htmlFor="alcohol-insight-none" className="text-sm">
                        None
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.alcoholInsightIntoIllness && (
              <p className="text-red-500 text-sm mt-1">
                {errors.alcoholInsightIntoIllness.message}
              </p>
            )}
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Dual Diagnosis & Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Agreeable With Hospitalization Or Detox Admission */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Agreeable With Hospitalization Or Detox Admission:
            </h3>
            <Controller
              name="agreeableWithHospitalizationDetox"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row flex-nowrap gap-4"
                >
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="yes" id="alcohol-hospital-yes" />
                    <Label htmlFor="alcohol-hospital-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-none w-fit">
                    <RadioGroupItem value="no" id="alcohol-hospital-no" />
                    <Label htmlFor="alcohol-hospital-no">No</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.agreeableWithHospitalizationDetox && (
              <p className="text-red-500 text-sm mt-1">
                {errors.agreeableWithHospitalizationDetox.message}
              </p>
            )}
          </div>

          {/* Motivated for Detox / Rehab */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Motivated for Detox / Rehab:
            </h3>
            <div className="space-y-3">
              <Controller
                name="motivatedForDetoxRehab"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3" // Vertical stacking as per original
                  >
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem
                        value="ambivalent"
                        id="motivated-ambivalent"
                      />
                      <Label htmlFor="motivated-ambivalent" className="text-sm">
                        Ambivalent
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="yes" id="motivated-yes" />
                      <Label htmlFor="motivated-yes" className="text-sm">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-none w-fit">
                      <RadioGroupItem value="no" id="motivated-no" />
                      <Label htmlFor="motivated-no" className="text-sm">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.motivatedForDetoxRehab && (
              <p className="text-red-500 text-sm mt-1">
                {errors.motivatedForDetoxRehab.message}
              </p>
            )}
          </div>
        </div>{" "}
        {/* End of grid-cols-2 for Hospitalization & Motivation */}
      </div>{" "}
      {/* End of Past Diagnosis & Motivation section */}
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

export default AlcoholBenzoForm;
