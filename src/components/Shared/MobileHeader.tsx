import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const MobileHeader = () => {
  return (
    <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Connectify
        </h1>
        <div className="flex items-center space-x-2">
          <Link href="/notifications">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
