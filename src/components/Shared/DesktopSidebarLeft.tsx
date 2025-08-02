import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Home, MessageCircle, Settings, User } from "lucide-react";

const DesktopSidebarLeft = () => {
  return (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <Link href="/feed">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
            ConnectHub
          </h1>
        </Link>

        <nav className="space-y-2">
          <Link href="/feed">
            <Button
              variant="default"
              className="w-full justify-start bg-purple-500 hover:bg-purple-600"
            >
              <Home className="h-4 w-4 mr-3" />
              Feed
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-3" />
              Messages
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="h-4 w-4 mr-3" />
              Profile
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default DesktopSidebarLeft;
