import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { Chat } from "@/models/chat.model";
import { UserCredentials, UserDetails } from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface TypeChats {
  chatId: string;
  type: "direct" | "group";
  groupName?: string;
  participants: string[];
  sender?: {
    userId: string;
    name: string;
    avatar?: string;
  };
  messages: {
    sender: any
    content: string;
    messageStatus: "sent" | "delivered" | "read";
    time?: Date;
  }[];
}

export async function GET(request: NextRequest) {

  try {

    const session = await auth()
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

    const user = await UserCredentials.findOne({ email })

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

    const userId = (user.userId as mongoose.Schema.Types.ObjectId).toString();

    const chats = await Chat.find({
      participants: { $in: [userId] },
    })

    let senderDetails = {};

    const data = await Promise.all(
      chats.map(async (chat) => {
        const senders = chat.participants.filter(
          (participant) => participant.toString() !== userId
        );

        
        if (senders.length > 1) {
          return undefined;
        }

        const sender = await UserDetails.findOne({
          _id: senders[0],
        });
        

        if (sender) {
          senderDetails = {
            userId: (sender._id as mongoose.Schema.Types.ObjectId).toString(),
            name: sender.name,
            avatar: sender.avatar,
          };
        }
        return {
          chatId: (chat._id as mongoose.Types.ObjectId).toString(),
          type: chat.type,
          groupName: chat.type === "group" ? chat.groupName : undefined,
          participants: chat.participants.map((participant) =>
            participant.toString()
          ),
          sender: senderDetails as TypeChats["sender"],
          messages: chat.messages.map((message) => ({
            sender: message.sender.toString(),
            content: message.content,
            messageStatus: message.messageStatus,
            time: message.time,
          })),
        };
      })
    );

    return NextResponse.json<ApiResponse<TypeChats[]>>(
      {
        success: true,
        status: 200,
        message: "Chats Fetched Successfully",
        data: data.filter((chat) => chat !== undefined),
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
