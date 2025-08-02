import { useEffect, useRef } from "react";
import { ChatSocket, MessagePayload } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/events.socket";

export function useChatSocket(
  userId: string,
  onMessage: (msg: MessagePayload) => void
) {
  const socketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Create and connect socket
    socketRef.current = new ChatSocket("http://localhost:3500", {
      query: { userId },
      autoConnect: true,
    });

    // Listen for incoming messages
    socketRef.current.onMessage(onMessage);

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, onMessage]);

  return socketRef;
}