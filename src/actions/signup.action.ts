"use server";

import { connectDB } from "@/lib/db.connect";
import { UserCredentials, UserDetails, UserHandle } from "@/models/user.model";
import { ApiResponse } from "@/interfaces/api.interface";
import mongoose from "mongoose";

interface SignupPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export async function signup(
  signupPayload: SignupPayload
): Promise<ApiResponse> {
  try {
    await connectDB();
    const name = signupPayload.firstName.trim() + " " + signupPayload.lastName.trim();
    const newUserCredentials = new UserCredentials({
      name,
      email: signupPayload.email,
      password: signupPayload.password,
    });

    const newUserDetails = await UserDetails.create({
      name,
    });

    
    newUserCredentials.userId =
      newUserDetails._id as mongoose.Schema.Types.ObjectId;

    const newUserHandle = await UserHandle.create({
        userId : newUserDetails._id
    })

    const saved = newUserCredentials.save();

    if (!saved || !newUserDetails || !newUserHandle) {
      return {
        success: false,
        status: 400,
        message: "Failed to create",
      };
    }

    return {
      success: true,
      status: 201,
      message: "User account created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}
