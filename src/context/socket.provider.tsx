"use client";

import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./socket.context";
import UserContext from "./user.context";

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user?.userId;
  const [isConnected, setIsConnected] = useState(false);

  const socket = useMemo(() => {
    const serverUrl = process.env.NEXT_PUBLIC_CHAT_APP_SERVER_URL;
    
    if (!serverUrl) {
      console.error("NEXT_PUBLIC_CHAT_APP_SERVER_URL is not defined");
      return null;
    }

    return io(serverUrl, {
      query: {
        userId,
      },
      autoConnect: false,
    });
  }, [userId]);

  useEffect(() => {
    if (!socket || !userId) {
      console.log("Socket not initialized or no userId");
      return;
    }

    if (!socket.connected) {
      socket.connect();
      console.log("Connecting to socket...");
    }

    // Listen for connection events
    const handleConnect = () => {
      setIsConnected(true);
      console.log("Connected to socket with ID:", socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Disconnected from socket");
    };

    const handleConnectError = (error: any) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    };

    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      // Clean up event listeners
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      
      if (socket.connected) {
        socket.disconnect();
        console.log("Disconnected from socket");
      }
    };
  }, [socket, userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
