import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { UserCredentials, UserDetails, UserHandle } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    const email = session?.user?.email;

    if (!session?.user || !email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 309,
          message: "You are not logged in",
        },
        {
          status: 309,
        }
      );
    }
    await connectDB();

    const userCredentials = await UserCredentials.findOne({ email }).select("userId name");

    if (!userCredentials) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User not found... Please signup first",
        },
        {
          status: 404,
        }
      );
    }

    const userDetails = await UserDetails.findById(userCredentials.userId).select("bio avatar dateOfBirth location");

    if (!userDetails) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User details not found",
        },
        {
          status: 404,
        }
      );
    }

    const userHandle = await UserHandle.findOne({userId: userCredentials.userId}).select("following followers");

    if (!userHandle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User handle not found",
        },
        {
          status: 404,
        }
      );
    }

    // console.log(userHandle);
    

    const data = {
        userId: userCredentials.userId,
        name: userCredentials.name,
        bio: userDetails.bio,
        avatar: userDetails.avatar,
        dateOfBirth: userDetails.dateOfBirth,
        location: userDetails.location,
        following: userHandle?.following,
        followers: userHandle?.followers,
        posts : []
    }

    // console.log(data);
    

    return NextResponse.json<ApiResponse<typeof data>>(
      {
        success: true,
        status: 200,
        message: "User fetched successfully",
        data,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
