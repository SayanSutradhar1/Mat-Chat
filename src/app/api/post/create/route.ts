import { ApiResponse, PostCreateBody } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { Post } from "@/models/posts.model";
import { UserHandle } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, caption, picture } = (await req.json()) as PostCreateBody;

  try {
    await connectDB();
    const user = await UserHandle.findOne({
      userId
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

    const post = new Post({
      userId,
      picture,
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
