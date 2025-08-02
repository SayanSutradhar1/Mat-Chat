"use client";

import { useContext } from "react";
import { SocketContext } from "@/context/socket.context";

export function useSocket() {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  
  return {
    socket: context.socket,
    isConnected: context.isConnected,
    socketId: context.socket?.id,
    isInitialized: !!context.socket,
  };
} 