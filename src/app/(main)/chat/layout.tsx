"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/useMobile";
import { apiGet } from "@/lib/apiResponse";
import { decryptMessage } from "@/lib/encryption";
import {
  Bell,
  Home,
  MessageCircle,
  Plus,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TypeChats {
  chatId: string;
  type: "direct" | "group";
  groupName?: string;
  participants: string[];
  sender?: {
    userId: string;
    name: string;
    avatar?: string;
  };
  messages: {
    sender: string;
    content: string;
    messageStatus: "sent" | "delivered" | "read";
    time?: Date;
  }[];
}

export default function ChatLayout({ children }: { children: ReactNode }) {
  const isMobile = useMobile();
  const pathname = usePathname();

  console.log(pathname);

  const [searchQuery, setSearchQuery] = useState("");

  const [Chats, setChats] = useState<TypeChats[]>();

  const getAllChats = useCallback(async () => {
    try {
      const response = await apiGet<TypeChats[]>("/api/user/chats/getAllChats");

      if (response.success) {
        setChats(response.data);
        toast.success("Chats fetched successfully");
      } else {
        toast.error("Failed to fetch chats");
      }
    } catch (error) {
      toast.error((error as Error).message ?? "An error occurred while fetching chats");
    }
  }, []);

  useEffect(() => {
    getAllChats();
  }, [getAllChats]);

  // if (isMobile) return <>{children}</>;
  if(!pathname.endsWith("/chat") && isMobile){
    return <>{children}</>
  }

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-4 bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full bg-white">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ConnectHub
            </h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {Chats?.map((chat, i) => (
              <Link
                href={`/chat/${chat.chatId}`}
                key={chat.chatId}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  i.toString() === chat.chatId
                    ? "bg-purple-50 border border-purple-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={chat.sender?.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>{chat.sender?.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.type === "group" && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Users className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.sender?.name || "Unknown User"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {chat.messages.length > 0
                        ? chat.messages[
                            chat.messages.length - 1
                          ].time?.getTime()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content
                      : "New Message"}
                  </p>
                </div>
                {chat.messages.length > 0 && (
                  <Badge className="bg-purple-500 text-white text-xs">
                    {
                      chat.messages.filter(
                        (msg) => msg.messageStatus !== "read"
                      ).length
                    }
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex bg-white border-r border-gray-200 flex-col col-span-1">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">ConnectHub</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {Chats?.map((chat, i) => (
              <Link
                href={`/chat/${chat.chatId}`}
                key={chat.chatId}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  i.toString() === chat.chatId
                    ? "bg-purple-50 border border-purple-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={chat.sender?.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>{chat.sender?.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.type === "group" && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Users className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.sender?.name || "Unknown User"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {chat.messages.length > 0
                        ? chat.messages[
                            chat.messages.length - 1
                          ].time?.getTime()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.messages.length > 0
                      ? decryptMessage(chat.messages[chat.messages.length - 1].content)
                      : "New Message"}
                  </p>
                </div>
                {chat.messages.length > 0 && (
                  <Badge className="bg-purple-500 text-white text-xs">
                    {
                      chat.messages.filter(
                        (msg) => msg.messageStatus !== "read"
                      ).length
                    }
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area - Only visible on desktop */}
      {/* {(!isMobile || !pathname.endsWith("/chat")) && (
        <div className="hidden lg:block w-screen md:w-auto col-span-3">
          {children}
        </div>
      )} */}

      {!isMobile && (
        <div className="hidden lg:block w-screen md:w-auto col-span-3">
          {children}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50">
        <div className="flex items-center justify-around">
          <Link href="/feed">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Feed</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-purple-500"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Chat</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
