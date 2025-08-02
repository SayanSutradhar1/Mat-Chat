import { auth } from "@/auth";
import { ApiResponse } from "@/interfaces/api.interface";
import { connectDB } from "@/lib/db.connect";
import { decryptMessage } from "@/lib/encryption";
import { Chat } from "@/models/chat.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const chatId = request.nextUrl.searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        status: 400,
        message: "No Chat ID provided",
      },
      {
        status: 400,
      }
    );
  }

  try {

    const session = await auth()

    const email = session?.user?.email

    if(!session?.user || !email){
      return NextResponse.json<ApiResponse>({
        status : 401,
        success : false,
        message : "Unauthorized"
      },{
        status : 401
      })
    }

    await connectDB();

    const chat = await Chat.findById(chatId).populate("participants","name avatar");

    // console.log(chat);
    
    // const messages = chat?.messages.map(m=>{
    //   return {...m,content : decryptMessage(m.content)}
    // })
    

    if (!chat) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          status: 404,
          message: "Chat not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json<ApiResponse<typeof chat>>(
      {
        success: true,
        status: 200,
        message: "Chat fetched successfully",
        data: chat,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: (error as Error).message,
    }, {
      status: 500,
    });
  }

}