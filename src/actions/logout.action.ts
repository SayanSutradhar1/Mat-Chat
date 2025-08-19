"use server";

import { signOut } from "@/auth";

export async function logout() {
  try {
    await signOut({
        redirect : false
    });
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Failed to log out",
    };
  }
}
