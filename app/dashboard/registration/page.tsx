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
      toast.success("patient registered successfully");
    } catch (error) {
      let errorMessage = "Failed to create note. Please try again.";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      reset();
      toast.dismiss(loadingId);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm px-2 sm:px-3 py-4">
        <div className="px-2 sm:px-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Registration
          </h1>
        </div>

        <div className="border-secondary1 m-2 py-4 sm:py-6 px-2 sm:px-4 border rounded-lg">
          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit(registerPatient)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-sm sm:text-base">
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  placeholder="Aahsham Iqbal"
                  {...register("fullname")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.fullname?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm sm:text-base">
                  Date Of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  placeholder="09/12/2001"
                  type="date"
                  {...register("dob")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.dob?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="race" className="text-sm sm:text-base">
                  Race
                </Label>
                <Input
                  id="race"
                  placeholder="African Black"
                  {...register("race")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.race && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.race?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm sm:text-base">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+123 456 789"
                  {...register("phonenumber")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.phonenumber && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.phonenumber?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm sm:text-base">
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder=""
                  {...register("address")}
                  className="bg-gray150 min-h-[80px] border-none"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.address?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Veteran</Label>
                  <Controller
                    name="veteran"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="veteran-yes" />
                          <Label htmlFor="veteran-yes" className="text-sm">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="veteran-no" />
                          <Label htmlFor="veteran-no" className="text-sm">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.veteran && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {errors.veteran?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Active Duty</Label>
                  <Controller
                    name="active_duty"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="active-yes" />
                          <Label htmlFor="active-yes" className="text-sm">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="active-no" />
                          <Label htmlFor="active-no" className="text-sm">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.active_duty && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {errors.active_duty?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="emergencycontact"
                  className="text-sm sm:text-base"
                >
                  Emergency Contact
                </Label>
                <Input
                  id="emergencycontact"
                  placeholder="Mother, Father etc."
                  {...register("emergencycontact")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.emergencycontact && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.emergencycontact?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="primaryCareProvider"
                  className="text-sm sm:text-base"
                >
                  Primary Care Provider
                </Label>
                <Input
                  id="primaryCareProvider"
                  placeholder="Dr. Ayesha Malik"
                  {...register("primary_care_provider")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.primary_care_provider && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.primary_care_provider?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceid" className="text-sm sm:text-base">
                  Insurance ID
                </Label>
                <Input
                  id="insuranceid"
                  placeholder="1 1 - 4 2 2 3 4 7"
                  {...register("insuranceid")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.insuranceid && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.insuranceid?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="behavioralHealthProvider"
                  className="text-sm sm:text-base"
                >
                  Behavioral Health Provider
                </Label>
                <Input
                  id="behavioralHealthProvider"
                  placeholder="Dr. Ayesha Malik"
                  {...register("behavioral_health_provider")}
                  className="bg-gray150 border-none h-10 sm:h-12"
                />
                {errors.behavioral_health_provider && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    {errors.behavioral_health_provider?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center sm:justify-end pt-4 sm:pt-6">
              <Button
                type="submit"
                className="bg-blue400 hover:bg-blue-600 text-white px-4 sm:px-5 py-3 sm:py-4 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "REGISTERING..." : "REGISTER"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
