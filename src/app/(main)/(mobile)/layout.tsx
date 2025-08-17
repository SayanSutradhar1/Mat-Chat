import BottomNavbar from "@/components/Shared/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Bell, Link } from "lucide-react";
import { ReactNode } from "react";

const LayoutForMobile = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen fixed">
      <div className="bg-white border-b border-gray-200 p-4">
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
      {children}
      <BottomNavbar />
    </div>
  );
};

export default LayoutForMobile;
