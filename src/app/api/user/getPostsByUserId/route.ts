import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { Post as PostType } from "@/interfaces/user.interface";
import { IPosts, Post } from "@/models/posts.model";
import { UserCredentials } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    // console.log("Triggered");
    

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

    const userCredentials = await UserCredentials.findOne({
      email: email,
    }).select("userId name");

    if (!userCredentials) {
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

    const posts = await Post.find({
      userId: userCredentials.userId,
    })
      .select("+createdAt")
      .populate("likes", "userId name avatar");

    if (!posts || posts.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "No posts found for this user",
        },
        {
          status: 404,
        }
      );
    }

    // Fix: data should be PostType[]
    const data: PostType[] = posts.map((post: IPosts) => ({
      postId: (post._id as mongoose.Schema.Types.ObjectId).toString(),
      caption: post.caption,
      //   createdAt: post.createdAt,
      likes: post.likes.map((like: any) => ({
        userId: like.userId ? like.userId.toString() : "",
        name: like.name,
        avatar: like.avatar,
      })),
      comments: post.comments.map((comment: any) => ({
        userId: (comment.userId as mongoose.Schema.Types.ObjectId).toString(),
        content: comment.content,
        createdAt: comment.createdAt,
      })),
      picture: post.picture ?? "",
      userId: (post.userId as mongoose.Schema.Types.ObjectId).toString(),
    }));

    return NextResponse.json<ApiResponse<typeof data>>(
      {
        success: true,
        status: 200,
        message: "Posts fetched successfully",
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // console.log(error);
    
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
