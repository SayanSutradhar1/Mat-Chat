import { MessageCircle, Users, Bell, Share2 } from "lucide-react";
import "../globals.css";
import { APP_NAME } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {

  const session = await auth();

  
  if(session?.user?.email){
    redirect("/feed")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-6 box-border mt-20">
      {/* Title */}
      <h1 className="text-5xl font-bold text-purple-700 mb-6">
        Welcome to {APP_NAME}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-12">
        A modern social media platform where you can share your thoughts,
        connect with friends, and chat in real-time. Stay updated with
        notifications and grow your network effortlessly.
      </p>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-8 max-w-5xl mb-16">
        <Feature
          icon={<Users className="w-10 h-10 text-purple-600" />}
          title="Connect"
          desc="Follow friends and discover new people."
        />
        <Feature
          icon={<Share2 className="w-10 h-10 text-purple-600" />}
          title="Share"
          desc="Post updates, photos, and your thoughts instantly."
        />
        <Feature
          icon={<MessageCircle className="w-10 h-10 text-purple-600" />}
          title="Chat"
          desc="Enjoy real-time messaging powered by Socket.IO."
        />
        <Feature
          icon={<Bell className="w-10 h-10 text-purple-600" />}
          title="Stay Notified"
          desc="Get instant updates when friends interact with you."
        />
      </div>
      <div>
        <p className="text-gray-500 mb-4">
          Ready to dive in? Sign up now and start connecting!
        </p>
        <div>
          <Link href="/login" className="mr-4">
            <Button className="bg-white border border-purple-500 text-purple-500 hover:text-white hover:bg-purple-500 duration-150 cursor-pointer w-24 h-10">
              Log In
            </Button>
          </Link>
          <Link href="/signup" className="cursor-pointer">
            <Button className="bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer w-24 h-10 duration-150">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Instructions */}
      {/* <div className="bg-white shadow-md rounded-2xl p-8 max-w-2xl text-left">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          How to Get Started
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Sign up and create your profile.</li>
          <li>Find and follow people you know.</li>
          <li>Share posts, images, and updates on your feed.</li>
          <li>Start chatting with your friends in real-time.</li>
          <li>Stay notified about new followers and interactions.</li>
        </ul>
      </div> */}

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} {APP_NAME} · Built for connecting people
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white shadow rounded-2xl p-6 hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
