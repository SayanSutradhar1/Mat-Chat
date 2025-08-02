import BottomNavbar from "@/components/Shared/BottomNavbar";
import MobileHeader from "@/components/Shared/MobileHeader";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DesktopSidebarLeft = dynamic(
  () => import("@/components/Shared/DesktopSidebarLeft")
);
const DesktopSidebarRight = dynamic(
  () => import("@/components/Shared/DesktopSidebarRight")
);

const Feedlayout = async ({ children }: { children: ReactNode }) => {

  const session = await auth()

  // if(!session?.user){
  //   redirect("/login")
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <div className="max-w-7xl mx-auto flex">
        <DesktopSidebarLeft />

        {children}

        <DesktopSidebarRight />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Feedlayout;
