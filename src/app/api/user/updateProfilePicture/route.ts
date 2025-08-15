import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { UserCredentials, UserDetails } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email || !session.user) {
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

    const userCredential = await UserCredentials.findOne({
      email,
    });

    if (!userCredential) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User Not Found",
        },
        {
          status: 404,
        }
      );
    }

    const formData = await req.formData();

    const userId = userCredential.userId;
    const picture = formData.get("picture") as File;

    const arrayBuffer = await picture.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer, "image", "test");

    if (!result) {
      return NextResponse.json<ApiResponse>(
        {
          status: 400,
          success: false,
          message: "Failed to upload Profile Picture",
        },
        {
          status: 400,
        }
      );
    }

    const userDetails = await UserDetails.findById(userId);

    if (!userDetails) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    userDetails.avatar = result.secure_url
    await userDetails.save()

    return NextResponse.json<ApiResponse>({
        success : true,
        status : 200,
        message : "Profile Picture Updated Successfully"
    })
  } catch (error) {
    return NextResponse.json<ApiResponse>({
        success : false,
        status : 500,
        message : "Internal Server Error",
        error : (error as Error).message
    })
  }
}
