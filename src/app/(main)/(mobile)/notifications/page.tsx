"use client";

import { useDuration } from "@/hooks/useDuration";
import { useSocket } from "@/hooks/useSocket";
import { apiGet } from "@/lib/apiResponse";
import mongoose from "mongoose";
import { useEffect, useState } from "react";

interface Notification {
  userId: mongoose.Schema.Types.ObjectId;
  header: string;
  content?: string;
  timeStamp: Date;
}

const Page = () => {
  const { socket, isConnected, socketId } = useSocket();

  const [notifications, setNotifications] = useState<Notification[]>();

  const timeAgo = useDuration();


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
    console.log(notifications);
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

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
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
              <p className="text-sm text-gray-700 leading-snug">{n.content}</p>
              <span className="text-xs text-gray-400">
                {timeAgo(n.timeStamp)}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic">No notifications yet</p>
      )}
    </div>
  );
};

export default Page;
