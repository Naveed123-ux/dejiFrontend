"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { patientRegister } from "@/app/_apis/patient";
const registrationSchema = yup.object().shape({
  fullname: yup.string().min(3).max(50).required("Full name is required"),
  dob: yup.string().required("Date of birth is required"),
  race: yup.string().min(3).max(40).required("race is required"),
  phonenumber: yup
    .string()
    .min(10)
    .max(15)
    .required("Phone number is required"),
  address: yup.string().min(5).max(100).required("Address is required"),
  veteran: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Veteran status is required"),
  active_duty: yup
    .string()
    .oneOf(["yes", "no"])
    .required("Active duty status is required"),
  emergencycontact: yup
    .string()
    .min(3)
    .max(50)
    .required("Emergency contact is required"),
  primary_care_provider: yup
    .string()
    .min(3)
    .max(50)
    .required("Primary care provider is required"),
  insuranceid: yup.string().min(5).max(50).required("insuranceid is required"),
  behavioral_health_provider: yup
    .string()
    .min(3)
    .max(50)
    .required("Behavioral health provider is required"),
});
export default function Registration() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  });
  const [loading, setLoading] = useState(false);
  const registerPatient = async (
    data: yup.InferType<typeof registrationSchema>
  ) => {
    let loadingId;
    try {
      setLoading(true);
      loadingId = toast.loading("Submitting registration...");
      const formattedDob = new Date(data.dob).toISOString().split("T")[0];
      const response = await patientRegister({ ...data, dob: formattedDob });
      console.log("Registration submitted:", data);
      toast.success("patient registered sucssefuly");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(typeof error === "string" ? error : "Registration failed");
    } finally {
      setLoading(false);
      reset();
      toast.dismiss(loadingId);
    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm px-3 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Registration</h1>
        </div>

        <div className="border-secondary1 m-2 py-6 px-4 border rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(registerPatient)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="Aahsham Iqbal"
                  {...register("fullname")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.fullname && (
                <p className="text-red-500 text-sm">
                  {errors.fullname?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                <Input
                  id="dateOfBirth"
                  placeholder="09/12/2001"
                  type="date"
                  {...register("dob")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob?.message}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="race">Race</Label>
                <Input
                  id="race"
                  placeholder="African Black"
                  {...register("race")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.race && (
                <p className="text-red-500 text-sm">{errors.race?.message}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+123 456 789"
                  {...register("phonenumber")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.phonenumber && (
                <p className="text-red-500 text-sm">
                  {errors.phonenumber?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder=""
                  {...register("address")}
                  className="bg-gray150 min-h-[80px] border-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Veteran</Label>
                  {/* Use Controller for RadioGroup */}
                  <Controller
                    name="veteran" // This must match the field name in your yup schema
                    control={control} // Pass the control object from useForm
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange} // Connects RadioGroup's change event to react-hook-form
                        defaultValue={field.value} // Sets the initial value of the RadioGroup
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="veteran-yes" />
                          <Label htmlFor="veteran-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="veteran-no" />
                          <Label htmlFor="veteran-no">No</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.veteran && (
                    <p className="text-red-500 text-sm">
                      {errors.veteran?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Active Duty</Label>
                  <Controller
                    name="active_duty"
                    control={control}
                    render={(
                      { field } // <--- REMOVE CURLY BRACES AND USE PARENTHESES
                    ) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="active-yes" />
                          <Label htmlFor="active-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="active-no" />
                          <Label htmlFor="active-no">No</Label>
                        </div>
                      </RadioGroup>
                    )} // <--- CLOSE PARENTHESES HERE
                  />
                  {errors.active_duty && (
                    <p className="text-red-500 text-sm">
                      {errors.active_duty?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencycontact">Emergency Contact</Label>
                <Input
                  id="emergencycontact"
                  placeholder="Mother, Father etc."
                  {...register("emergencycontact")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.emergencycontact && (
                <p className="text-red-500 text-sm">
                  {errors.emergencycontact?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="primaryCareProvider">
                  Primary Care Provider
                </Label>
                <Input
                  id="primaryCareProvider"
                  placeholder="Dr. Ayesha Malik"
                  {...register("primary_care_provider")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.primary_care_provider && (
                <p className="text-red-500 text-sm">
                  {errors.primary_care_provider?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="insuranceid">insuranceid</Label>
                <Input
                  id="insuranceid"
                  placeholder="1 1 - 4 2 2 3 4 7"
                  {...register("insuranceid")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.insuranceid && (
                <p className="text-red-500 text-sm">
                  {errors.insuranceid?.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="behavioralHealthProvider">
                  Behavioral Health Provider
                </Label>
                <Input
                  id="behavioralHealthProvider"
                  placeholder="Dr. Ayesha Malik"
                  {...register("behavioral_health_provider")}
                  className="bg-gray150 border-none"
                />
              </div>
              {errors.behavioral_health_provider && (
                <p className="text-red-500 text-sm">
                  {errors.behavioral_health_provider?.message}
                </p>
              )}
            </div>

            {/* <div className="flex justify-between pt-6">
              <Button
                type="button"
                onClick={handleClearinghouse}
                className="bg-blue400 hover:bg-blue-600 text-white"
              >
                SEND TO CLEARINGHOUSE
              </Button>
            </div> */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue400 hover:bg-blue-600 text-white px-5 py-4"
                disabled={loading}
              >
                REGISTER
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
