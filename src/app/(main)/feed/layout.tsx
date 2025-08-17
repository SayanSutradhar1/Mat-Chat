import BottomNavbar from "@/components/Shared/BottomNavbar";
import MobileHeader from "@/components/Shared/MobileHeader";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const DesktopSidebarLeft = dynamic(
  () => import("@/components/Shared/DesktopSidebarLeft")
);
const DesktopSidebarRight = dynamic(
  () => import("@/components/Shared/DesktopSidebarRight")
);

const Feedlayout = async ({ children }: { children: ReactNode }) => {

  // const session = await auth()

  // if(!session?.user){
  //   redirect("/login")
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <div className="w-full mx-auto flex">
        <DesktopSidebarLeft />

        {children}

        <DesktopSidebarRight />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Feedlayout;
