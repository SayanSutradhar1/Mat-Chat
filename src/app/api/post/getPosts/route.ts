import { ApiResponse } from "@/interfaces/api.interface";
import { IPosts, Post } from "@/models/posts.model";
import { UserDetails } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = (await Post.find({}).select("+createdAt").sort({_id:-1})) as IPosts[];

    const data = await Promise.all(
      posts.map(async (post) => {
        const user = await UserDetails.findOne({
          _id: post.userId,
        });

        return {
          postId : (post._id as mongoose.Schema.Types.ObjectId).toString(),
          file: post.file,
          avatar:user?.avatar,
          caption: post.caption,
          userId : user?._id,
          user: user?.name,
          likes: post.likes,
          comments: post.comments,
          createdAt : post.createdAt
        };
      })
    );



    return NextResponse.json<ApiResponse<typeof data>>(
      {
        success: true,
        status: 200,
        message: "Posts Fetched Successfully",
        data
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success : false,
      status : 500,
      message : "Internal Server Error",
      error : (error as Error).message
    },{
      status : 500
    })
  }
}
