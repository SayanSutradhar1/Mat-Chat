import { MessageCircle, Users, Bell, Share2 } from "lucide-react";
import "./globals.css"

export default function LandingPage() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-6">
          {/* Title */}
          <h1 className="text-5xl font-bold text-purple-700 mb-6">
            Welcome to Connectify
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

          {/* Instructions */}
          <div className="bg-white shadow-md rounded-2xl p-8 max-w-2xl text-left">
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
          </div>

          {/* Footer */}
          <footer className="mt-12 text-gray-500 text-sm">
            © {new Date().getFullYear()} Connectify · Built for connecting
            people
          </footer>
        </div>
      </body>
    </html>
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
