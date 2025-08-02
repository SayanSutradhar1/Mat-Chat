import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { phoneNumber } = await req.json();

  try {
    const response = await sendMessage(phoneNumber);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error(
      "Error sending WhatsApp message:",
      error.response?.data || error.message
    );

    return NextResponse.json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}

async function sendMessage(phoneNumber: string) {
  const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "image",
    image: {
      link: "https://dummyimage.com/600x400/000/fff.png&text=Dummy",
      caption: "This is a dummy image",
    },
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
