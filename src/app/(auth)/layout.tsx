import { Heart, MessageCircle, Users, Zap } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "../globals.css";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const session = await auth();
  if (session?.user) {
    redirect("/feed");
  }


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center px-4">
            {/* Left side - Branding */}
            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ConnectHub
                </h1>
                <p className="text-xl text-gray-600 max-w-md mx-auto lg:mx-0">
                  Where conversations come alive and connections flourish
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Real-time Chat</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Group Chats</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span className="text-sm">Stories & Status</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Lightning Fast</span>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
        <Toaster/>
      </body>
    </html>
  );
}
