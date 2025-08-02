"use server"

import { signIn } from "@/auth";

interface CredentialForLogin {
  email: string;
  password: string;
}

export const login = async (loginCredentials: CredentialForLogin) => {
  try {
    const result = await signIn("credentials", {
      email: loginCredentials.email,
      password: loginCredentials.password,
      redirect: false, // Prevent redirect, get result object
    });

    if (result && result.error) {
      return {
        success: false,
        message: result.error || "Login failed",
      };
    }

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Login failed",
    };
  }
};