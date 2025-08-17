"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserContext from "@/context/user.context";
import { useSocket } from "@/hooks/useSocket";
import { apiGet } from "@/lib/apiResponse";
import { decryptMessage } from "@/lib/encryption";
import { SOCKET_EVENTS } from "@/lib/events.socket";
import { MessagePayload } from "@/lib/socket";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCheck,
  Clock,
  Mic,
  Paperclip,
  Send,
  Smile
} from "lucide-react";
import Link from "next/link";
import {
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

interface ChatDetails {
  type: "direct" | "group";
  groupName?: string;
  participants: {
    _id: string;
    avatar?: string;
    name: string;
  }[];
  messages: {
    sender: string;
    receiver?: string;
    content: string;
    messageStatus: "sent" | "delivered" | "read";
    time?: Date;
  }[];
}

// Message status type
type MessageStatus = "pending" | "sent" | "read";

// Extended message interface with status
interface ExtendedMessagePayload extends MessagePayload {
  id?: string;
  status: MessageStatus;
}

const ChatPage = ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = use(params);

  const context = useContext(UserContext);
  const { socket, isConnected, socketId } = useSocket();

  const userId = context?.user?.userId ?? "";

  const [chatDetails, setChatDetails] = useState<ChatDetails>();

  const [message, setMessage] = useState("");

  const [Messages, setMessages] = useState<ExtendedMessagePayload[]>([]);

  const getChat = useCallback(async () => {
    try {
      const response = await apiGet<ChatDetails>(
        `/api/user/chats/getChatById?chatId=${chatId}`
      );
      if (response.success) {
        setChatDetails(response.data as ChatDetails);
        // Initialize Messages from chat history
        setMessages(
          (response?.data?.messages as MessagePayload[]).map((msg) => ({
            chatId,
            content: decryptMessage(msg.content),
            sender: msg.sender,
            receiver: msg.receiver,
            timestamp: msg.timestamp,
            messageStatus: msg.messageStatus,
            status: "read" as MessageStatus, // Assume old messages are read
          }))
        );
        toast.success("Messages retrieved successfully");
      } else {
        toast.error("Failed to retrieve chats");
      }
    } catch (error) {
      console.log(error);
      
      toast.error("An error occurred");
    }
  }, [chatId]);

  useEffect(() => {
    getChat();
  }, [getChat]);

  const receiver = useMemo(
    () => chatDetails?.participants.find((p) => p._id !== userId)?._id,
    [chatDetails, userId]
  );

  useEffect(() => {
    if (!socket || !userId) return;

    if (isConnected) {
      console.log("Socket connected:", socketId);
    }

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE, (msg: MessagePayload) => {
      const extendedMsg: ExtendedMessagePayload = {
        ...msg,
        status: "delivered" as MessageStatus,
      };
      setMessages((prev) => [...prev, extendedMsg]);
    });

    // Listen for message status updates

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE);
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE_STATUS);
    };
  }, [socket, userId, isConnected, socketId]);

  const sendMessage = () => {
    if (!message.trim() || !receiver || !socket) return;

    const messageId = Date.now().toString(); // Simple ID generation
    const msgPayload: ExtendedMessagePayload = {
      chatId,
      content: message,
      sender: userId,
      receiver,
      timestamp: new Date().toISOString(),
      messageStatus: "processing",
      id: messageId,
      status: "pending" as MessageStatus,
    };

    setMessages((prev) => [...prev, msgPayload]);
    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_SEND, msgPayload);
    setMessage("");

    // Simulate status updates (in real app, these would come from server)
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Status icon component
  const StatusIcon = ({ status }: { status: MessageStatus }) => {
    const iconClass = "h-3 w-3 sm:h-4 sm:w-4";
    
    switch (status) {
      case "pending":
        return <Clock className={`${iconClass} text-gray-400 animate-pulse`} />;
      case "sent":
        return <Check className={`${iconClass} text-gray-400`} />;
      case "read":
        return <CheckCheck className={`${iconClass} text-blue-500`} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {/* Back button for mobile */}
            <Link href={"/chat"}>
              <Button variant="ghost" size="sm" className="md:hidden p-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            </Link>
            
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage
                src={
                  chatDetails?.groupName
                    ? chatDetails.groupName
                    : chatDetails?.participants.find((p) => p._id !== userId)
                        ?.avatar || "/placeholder.svg"
                }
              />
              <AvatarFallback className="text-xs sm:text-sm">
                {chatDetails?.groupName
                  ? chatDetails.groupName
                  : chatDetails?.participants.find((p) => p._id !== userId)
                      ?.name[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {chatDetails?.groupName
                  ? chatDetails.groupName
                  : chatDetails?.participants.find((p) => p._id !== userId)
                      ?.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {`Send Message to ${chatDetails?.groupName || chatDetails?.participants.find(p=>p._id!==userId)?.name.split(" ")[0]}`}
              </p>
            </div>
          </div>
          
          {/* <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-2 sm:px-4 py-2 overflow-y-auto">
        <div className="space-y-2 sm:space-y-4">
          {Messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                  msg.sender === userId
                    ? "bg-purple-500 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-xs ${msg.sender === userId ? "text-purple-100" : "text-gray-500"}`}
                  >
                    {msg.timestamp}
                  </p>
                  {msg.sender === userId && (
                    <div className="flex items-center ml-2">
                      <StatusIcon status={msg.status} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-2 sm:px-4 py-2 sm:py-4 flex-shrink-0">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="sm" className="p-1 sm:p-2">
            <Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 sm:p-2">
            <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-8 sm:pr-10 text-sm sm:text-base h-9 sm:h-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          <Button
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 p-1 sm:p-2 h-9 w-9 sm:h-10 sm:w-10"
            onClick={sendMessage}
          >
            {message ? (
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
