import { ApiResponse, UserCreateBody } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { UserCredentials, UserDetails, UserHandle } from "@/models/user.model";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = (await req.json()) as UserCreateBody;

    await connectDB();

    const user = await UserCredentials.findOne({
      email,
    });

    if (user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 409,
          message: "User Already Exists",
        },
        {
          status: 409,
          statusText: "conflict",
        }
      );
    }


    const newUserDetails = await UserDetails.create({
      name: name,
    })

    const newUser = await UserCredentials.create({
      userId: newUserDetails._id,
      email,
      name,
      password,
    })

    const newUserHandle = await UserHandle.create({
      userId : newUserDetails._id
    })

    if (!newUser || !newUserDetails || !newUserHandle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 400,
          message: "Failed to signup",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json<ApiResponse<typeof newUser>>(
      {
        success: true,
        status: 201,
        message: "User signed up successfully",
      },
      {
        status: 201,
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
