import BottomNavbar from "@/components/Shared/BottomNavbar";
import { APP_NAME } from "@/lib/utils";
import { ReactNode } from "react";

const LayoutForMobile = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-screen fixed">
      <div className="bg-white border-b border-gray-200 p-4 ">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {APP_NAME}
          </h1>
        </div>
      </div>
      {children}
      <BottomNavbar />
    </div>
  );
};

export default LayoutForMobile;
