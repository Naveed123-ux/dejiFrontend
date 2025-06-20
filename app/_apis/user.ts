import publicApi from "@/lib/axios";
import { signInSchema, SignupFormData } from "@/hooks/types/types";
import axios, { AxiosError } from "axios";
export const SignUp = async (data: SignupFormData) => {
  try {
    const response = await publicApi.post("/signup", {
      ...data,
      role: "Medical Officer",
    });
    return response.data;
  } catch (error) {
    console.error("Signup error:");
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      throw new Error(
        error.response?.data?.detail || "Signup failed. Please try again."
      );
    }
    throw new Error(
      "An unexpected error occurred during signup. Please try again."
    );
    // Re-throw the error for further handling
  }
};

export const SignIn = async (data: signInSchema) => {
  try {
    const response = await publicApi.post("/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Login error:", error.response?.data);
      throw new Error(
        error.response?.data?.detail || "Login failed. Please try again."
      );
    }
    console.error("Unexpected error during login:", error);
    throw new Error(
      "An unexpected error occurred during login. Please try again."
    );
  }
};
