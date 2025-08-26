"use client";

import { Bell, Home, LogOut, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { memo, useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import mongoose from "mongoose";
import { apiGet } from "@/lib/apiResponse";
import { useDuration } from "@/hooks/useDuration";
import { APP_NAME } from "@/lib/utils";
import { logout } from "@/actions/logout.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Notification {
  userId: mongoose.Schema.Types.ObjectId;
  header: string;
  content?: string;
  timeStamp: Date;
}

const DesktopSidebarLeft = () => {
  const { socket, isConnected, socketId } = useSocket();

  const [notifications, setNotifications] = useState<Notification[]>();

  const timeAgo = useDuration();

  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const response = await apiGet<Notification[]>(
        "/api/user/notification/getAllNotifications"
      );

      console.log(response);

      if (response.success) {
        setNotifications(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (isConnected) {
      console.log("Socket Connected With socketId", socketId);
    }

    socket?.on("notification", (data: Notification) => {
      setNotifications([...(notifications || []), data]);
    });
  }, [socket, isConnected, socketId]);


  const handleLogOut = async()=>{
    const toastId = toast.loading("Logging out...");
    try {
      const response = await logout()
      console.log(response);
      
      if(response.success) {
        toast.success("Logged out successfully");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging out");
    } finally {
      toast.dismiss(toastId);
      router.push("/login");
    }
  }

  return (
    <div className="hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 ">
      <div className="p-6">
        <Link href="/feed">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8 cursor-pointer">
            {APP_NAME}
          </h1>
        </Link>

        <nav className="space-y-2">
          <Link href="/feed">
            <Button
              variant="default"
              className="w-full justify-start bg-purple-500 hover:bg-purple-600 cursor-pointer"
            >
              <Home className="h-4 w-4 mr-3" />
              Feed
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" className="w-full justify-start cursor-pointer">
              <MessageCircle className="h-4 w-4 mr-3" />
              Messages
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start cursor-pointer">
              <User className="h-4 w-4 mr-3" />
              Profile
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start cursor-pointer" onClick={handleLogOut}>
            <LogOut className="h-4 w-4 mr-3" />
            Log Out
          </Button>
        </nav>

        <div className="py-8">
          <h1 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Notifications
          </h1>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {notifications && notifications.length > 0 ? (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition cursor-pointer shadow-sm"
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                      {n.header.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-snug">
                      {n.content}
                    </p>
                    <span className="text-xs text-gray-400">
                      {timeAgo(n.timeStamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">
                No notifications yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DesktopSidebarLeft);
