import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { Chat } from "@/models/chat.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    console.log("triggered");
    

    const { chatId, sender, receiver, message, time } = await request.json();

    await connectDB();
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Chat not found",
          status: 404,
        },
        {
          status: 404,
        }
      );
    }

    const newMessage = {
      sender: sender as mongoose.Schema.Types.ObjectId,
      receiver: receiver as mongoose.Schema.Types.ObjectId,
      content: message,
      messageStatus: "sent" as const,
      time: time as Date,
    };

    chat.messages.push(newMessage);
    await chat.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Message saved successfully",
      status: 200,
    });
  } catch (error) {}
}
