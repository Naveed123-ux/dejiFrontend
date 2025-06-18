"use client";

import type React from "react";
import Image from "next/image";
import SideImage from "@/public/images/signUpSidePic.png";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Signup submitted:", formData);
    // Simulate signup success and redirect to dashboard
    router.push("/");
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName !font-light">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Aahsham Iqbal"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            required
            className="h-11  border-none bg-[#f6f6f6]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email !font-light">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="login@gmail.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            className="h-11  border-none bg-[#f6f6f6]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber !font-light">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+123 456 789"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            required
            className="h-11  border-none bg-[#f6f6f6]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth !font-light">Date Of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            placeholder="09/12/2001"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
            className="h-11  border-none bg-[#f6f6f6]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password !font-light">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              className="h-11 pr-10  border-none bg-[#f6f6f6]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              required
              className="h-11 pr-10 border-none bg-[#f6f6f6]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className=" h-12 bg-[#3299FF] hover:bg-blue-600 text-white font-medium mt-6 w-full max-w-[140px] rounded-full"
          >
            SIGNUP <span className="ps-2">→</span>
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an Account?{" "}
          <Link
            href="/login"
            className="text-[#3299FF] hover:underline font-light ml-3 text-[14px]"
          >
            Sign in form here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
