import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Home, MessageCircle, Plus, User } from "lucide-react";

const BottomNavbar = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
      <div className="flex items-center justify-around">
        <Link href="/feed">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-purple-500"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Feed</span>
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1"
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
  );
};

export default BottomNavbar;
