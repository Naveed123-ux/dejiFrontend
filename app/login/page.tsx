"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SideImage from "@/public/images/loginSidepic.png";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { register } from "module";
import { SignIn } from "../_apis/user";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/AuthSlice";

const signInSchema = yup.object().shape({
  email: yup
    .string()
    .min(1, "Email is required")
    .required()
    .email("Invalid email format"),
  password: yup.string().required().min(1, "Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const router = useRouter();

  const signIn = async (data: yup.InferType<typeof signInSchema>) => {
    let toastingId;
    try {
      setLoading(true);
      console.log("Login submitted:");
      toastingId = toast.loading("Logging in...");
      const response = await SignIn(data);
      console.log("Login response:", response);
      toast.success("Login successful!");
      document.cookie = `token=${response.access_token}; path=/; max-age=3600`; // Set token in cookie
      // Simulate login success and redirect to dashboard
      dispatch(
        login({
          user: response.user,
          token: response.access_token,
        })
      );
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to create note. Please try again.";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastingId);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  return (
    <AuthLayout
      title="Log In"
      subtitle="Welcome back !!!"
      illustration={
        <div className="w-full h-full flex items-center justify-center rounded-bl-md rounded-tl-md">
          <Image
            src={SideImage}
            alt="Login Illustration"
            className="w-full  "
          />
        </div>
      }
    >
      <form onSubmit={handleSubmit(signIn)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="login@gmail.com"
            className="h-12  border-none bg-[#f6f6f6] text-black  !placeholder-black"
            {...register("email")}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-gray-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="h-12 pr-10 border-none bg-[#f6f6f6] !placeholder-black"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-[ #3299FF]" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-[140px] rounded-full h-12 bg-[#3299FF] hover:bg-blue-600 text-white font-medium "
            disabled={loading}
          >
            LOGIN <span className="ps-3"> →</span>
          </Button>
        </div>

        <div className="relative">
          {/* <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div> */}
          <div className="relative flex justify-center text-xs ">
            <span className="bg-white px-2 text-[#6096B4]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="h-12 border-[#3299FF] w-full max-w-[100px] rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 " viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleFacebookLogin}
            className="h-12 border-[#3299FF] w-full max-w-[100px] rounded-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 " fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Button>
        </div>

        <p className="text-center text-sm text-gray-700">
          Don't have an account yet?{" "}
          <Link
            href="/signup"
            className="text-[#3299FF] hover:underline font-medium"
          >
            Sign Up for free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
