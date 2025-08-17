"use client"

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Home, MessageCircle, Plus, User } from "lucide-react";
import { usePathname } from "next/navigation";

const BottomNavbar = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname.startsWith(route);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 ">
      <div className="flex items-center justify-around">
        <Link href="/feed">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${isActive("/feed") ? "text-purple-500":""}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Feed</span>
          </Button>
        </Link>
        <Link href="/chat">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${isActive("/chat") ? "text-purple-500":""}`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Button>
        </Link>
        <Link href={"/people"}>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${isActive("/people") ? "text-purple-500":""}`}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Connect</span>
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${isActive("/profile") ? "text-purple-500":""}`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavbar;
