import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { Chat } from "@/models/chat.model";
import { UserHandle } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { friendId, userId } = await request.json();

    if (!friendId || !userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 400,
          message: "Friend ID and User ID are required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const friendUserHandle = await UserHandle.findOne({
      userId: friendId,
    });

    if (!friendUserHandle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const userHandle = await UserHandle.findOne({
      userId: userId,
    });

    if (!userHandle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "Please signup first",
        },
        {
          status: 404,
        }
      );
    }

    if (userHandle.following.includes(friendUserHandle._id as mongoose.Schema.Types.ObjectId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 400,
          message: "You are already following this user.",
        },
        {
          status: 400,
        }
      );
    }

    userHandle.following.push(friendUserHandle.userId);
    friendUserHandle.followers.push(userHandle.userId);

    const existingChat = await Chat.findOne({
      participants: { $all: [userHandle.userId, friendUserHandle.userId] },
      type: "direct",
    });

    if (!existingChat) {
      const chat = new Chat({
        type: "direct",
        participants: [userHandle.userId, friendUserHandle.userId],
        messages: [],
      });

      userHandle.chats = [...(userHandle.chats || []), chat._id as mongoose.Schema.Types.ObjectId];
      friendUserHandle.chats = [
        ...(friendUserHandle.chats || []),
        chat._id as mongoose.Schema.Types.ObjectId,
      ];
      await chat.save();
    }

    await userHandle.save();
    await friendUserHandle.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        status: 200,
        message: "Followed successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in follow route:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        status: 500,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
