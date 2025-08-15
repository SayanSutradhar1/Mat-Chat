import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Post } from "@/models/posts.model";
import { UserCredentials, UserHandle } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

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

    const formData = await req.formData();

    const userCredentials = await UserCredentials.findOne({
      email,
    });

    if (!userCredentials) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "No user found",
        },
        {
          status: 404,
        }
      );
    }

    const userId = userCredentials.userId
    const file = formData.get("file") as File
    const caption = formData.get("caption") ?? "" as string

    if(!file){
      return NextResponse.json<ApiResponse>({
        success : false,
        status : 400,
        message : "No file Selected"
      })
    }

    await connectDB();
    const user = await UserHandle.findOne({
      userId,
    }).select("posts");

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User is not logged in or not found",
        },
        {
          status: 404,
        }
      );
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadToCloudinary(buffer,"auto","test")

    const post = new Post({
      userId,
      file : result?.secure_url,
      caption,
    });

    user.posts.push(post._id as mongoose.Schema.Types.ObjectId);

    await post.save();
    await user.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        status: 201,
        message: "Post Uploaded Successfully",
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
