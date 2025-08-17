import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { Notification } from "@/models/notification.model";
import { UserCredentials } from "@/models/user.model";
import { Document } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    const email = session?.user?.email;

    if (!session?.user || !email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 401,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user = await UserCredentials.findOne({
      email,
    }).select("email userId");

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const notifications = await Notification.find({
      userId: user?.userId,
    }).sort({_id:-1});

    return NextResponse.json<
      ApiResponse<Omit<typeof notifications, keyof Document>>
    >(
      {
        success: true,
        status: 200,
        message: "Notfications fetched successfully",
        data: notifications,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        status: 500,
        message: "Interbal Server Error",
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
