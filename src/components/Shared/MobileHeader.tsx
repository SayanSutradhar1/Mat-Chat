"use client";

import { Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { APP_NAME } from "@/lib/utils";
import toast from "react-hot-toast";
import { logout } from "@/actions/logout.action";
import { useRouter } from "next/navigation";

const MobileHeader = () => {

  const router = useRouter();


  const handleLogOut = async()=>{
    const toastId = toast.loading("Logging out...");
    try {
      const response = await logout()
      console.log(response);
      
      if(response.success) {
        toast.success("Logged out successfully");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging out");
    } finally {
      toast.dismiss(toastId);
      router.push("/login");
    }
  }

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {APP_NAME}
        </h1>
        <div className="flex items-center space-x-2">
          <Link href="/notifications">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant={"ghost"} size="sm" onClick={handleLogOut}>
            <LogOut />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
