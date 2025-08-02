import React from "react";
import { Button } from "../ui/button";
import { Search, User } from "lucide-react";
import Link from "next/link";

const MobileHeader = () => {
  return (
    <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          ConnectHub
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
