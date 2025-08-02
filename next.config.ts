import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key : "Access-Control-Allow-Origin",
          value: process.env.NEXT_PUBLIC_CHAT_APP_SERVER_URL || "",
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
      ],
    },
  ],
};

export default nextConfig;
