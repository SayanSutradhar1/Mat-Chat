import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import OtpVerify from "@/components/Auth/OtpVerify";
import { ApiResponse } from "@/interfaces/api.interface";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const { data, error } = await resend.emails.send({
      from: "Chat App <sayan321x@gmail.com>",
      to: email,
      subject: "Verify your email with chat app",
      react: OtpVerify({ otp }),
    });

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        status: 400,
        message: "failed to send otp . Try again",
        error: error.message,
      });
    }

    console.log(data);
    

    return NextResponse.json<ApiResponse>({
      success: true,
      status: 200,
      message: "Otp has been sent to your mail",
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      status: 500,
      message: "Internal Server error",
    });
  }
}
