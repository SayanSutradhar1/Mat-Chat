// hooks/useChatSocket.ts
"use client"

import { useEffect, useMemo, useRef } from "react";
import { ChatSocket, MessagePayload } from "@/lib/socket";
import { Socket } from "socket.io-client";

export function useChatSocket(userId: string, onMessage: (msg: MessagePayload) => void) {
  const socketRef = useRef<ChatSocket | null>(null);

  const socket = useMemo(() => {
    if (!userId || !process.env.NEXT_PUBLIC_CHAT_APP_SERVER_URL) return null;

    const newSocket = new ChatSocket(process.env.NEXT_PUBLIC_CHAT_APP_SERVER_URL, {
      query: { userId },
    });
    socketRef.current = newSocket;
    return newSocket;
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.onConnect(()=>{
      console.log("Socket is connected",socket.socketId);
    })

    socket.onMessage(onMessage);

    return () => {
      socket.disconnect();
    };
  }, [socket, userId]);

  return socketRef;
}
