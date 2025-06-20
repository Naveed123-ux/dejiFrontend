"use client";

import React, { useState } from "react";
import Image from "next/image";
import SideImage from "@/public/images/signUpSidePic.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SignUp } from "../_apis/user";
import toast from "react-hot-toast";

// --- Validation Schema ---
const signupSchema = yup.object().shape({
  fullname: yup.string().required("Full name is required."),
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Email is required."),
  mobile_number: yup
    .string()
    .matches(/^\+?[0-9]{10,15}$/, "Phone number is not valid.")
    .required("Phone number is required."),
  dob: yup
    .string()
    // .matches(
    //   /^\d{4}-\d{2}-\d{2}$/,
    //   "Date of birth must be in YYYY-MM-DD format."
    // )
    .required("Date of birth is required.")
    .typeError("Invalid date format."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Confirm password is required."),
});

// --- Signup Component ---
export default function Signup(data: {
  fullname: string;
  email: string;
  mobile_number: string;
  dob: string;
  password: string;
  confirmPassword: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: yup.InferType<typeof signupSchema>) => {
    try {
      setLoading(true);
      toast.loading("Creating account...");

      const formattedDob = new Date(data.dob).toISOString().split("T")[0];

      // Send updated payload
      const response = await SignUp({
        ...data,
        dob: formattedDob, // this will now be like "2025-05-31"
      });

      toast.dismiss(); // remove loading toast
      toast.success("Signup successful!");

      router.push("/dashboard");
    } catch (error: any) {
      toast.dismiss(); // remove loading toast
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle=""
      illustration={
        <div className="w-full h-full flex items-center justify-center">
          <Image src={SideImage} alt="SideSignUp" className="w-full" />
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="!font-light">
            Full Name
          </Label>
          <Input
            id="fullname"
            type="text"
            placeholder="Aahsham Iqbal"
            {...register("fullname")}
            className="h-11 border-none bg-[#f6f6f6]"
          />
          {errors.fullname && (
            <p className="text-red400 text-sm">{errors.fullname.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="!font-light">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="login@gmail.com"
            {...register("email")}
            className="h-11 border-none bg-[#f6f6f6]"
          />
          {errors.email && (
            <p className="!text-red-400 text-sm">{errors.email?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile_number" className="!font-light">
            Phone Number
          </Label>
          <Input
            id="mobile_number"
            type="tel"
            placeholder="+123 456 789"
            {...register("mobile_number")}
            className="h-11 border-none bg-[#f6f6f6]"
          />
          {errors.mobile_number && (
            <p className="text-red-500 text-sm">
              {errors.mobile_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className="!font-light">
            Date Of Birth
          </Label>
          <Input
            id="dob"
            type="date"
            placeholder="09/12/2001"
            {...register("dob")}
            className="h-11 border-none bg-[#f6f6f6]"
          />
          {errors.dob && (
            <p className="text-red-500 text-sm">{errors.dob.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="!font-light">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("password")}
              className="h-11 pr-10 border-none bg-[#f6f6f6]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-light">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("confirmPassword")}
              className="h-11 pr-10 border-none bg-[#f6f6f6]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="h-12 w-full max-w-[140px] rounded-full bg-[#3299FF] font-medium text-white hover:bg-blue-600 mt-6"
          >
            SIGNUP <span className="ps-2">→</span>
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an Account?{" "}
          <Link
            href="/login"
            className="text-[#3299FF] hover:underline ml-3 text-[14px] font-light"
          >
            Sign in from here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
