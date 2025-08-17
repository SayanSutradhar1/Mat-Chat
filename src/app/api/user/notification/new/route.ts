import { ApiResponse } from "@/interfaces/api.interface";
import { Notification } from "@/models/notification.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, header, content, timeStamp } = await req.json();

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User id not found",
        },
        {
          status: 404,
        }
      );
    }

    const newNotification = await Notification.create({
      userId,
      header,
      content,
      timeStamp,
    });

    if (!newNotification) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 400,
          message: "Failed to sent notification",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        status: 201,
        message: "Notification Sent Successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json<ApiResponse>({
        success : false,
        status : 500,
        message : "Internal Server Error",
        error : (error as Error).message
    })
  }
}
