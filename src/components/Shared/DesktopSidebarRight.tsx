"use client";

import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useContext, useEffect, useState } from "react";
import { apiGet } from "@/lib/apiResponse";
import mongoose from "mongoose";
import UserContext from "@/context/user.context";
import { useSocket } from "@/hooks/useSocket";

interface User {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  following: number;
  followers: mongoose.Schema.Types.ObjectId[];
  avatar: string;
}

const DesktopSidebarRight = () => {
  const context = useContext(UserContext);

  const { socket } = useSocket();

  const userId = context?.user?.userId;
  const name = context?.user?.name

  const [users, setUsers] = useState<User[]>();

  const fetchUsers = async () => {
    try {
      const response = await apiGet<User[]>("/api/user/getAllUser");

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFollow = async (friendId: mongoose.Schema.Types.ObjectId) => {
    socket?.emit("follow", {
      userId,
      friendId,
      senderName : name
    });
  };

  return (
    <div className="hidden xl:block w-96 bg-white border-l border-gray-200 h-screen sticky top-0 ">
      <div className=" space-y-6 h-full">
        {/* Trending Topics */}
        {/* <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Topics
            </h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{topic.tag}</p>
                    <p className="text-xs text-gray-500">{topic.posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Suggested Users */}
        <Card className="h-full border-none rounded-none">
          <CardContent className="p-4 h-full">
            <h3 className="font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              People You May Know
            </h3>
            <div className="space-y-3 h-full">
              {users?.map((user, index) => {
                if (String(user.userId) === userId) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          {user.followers.length}{" "}
                          {user.followers.length === 1 ? "Follower" : "Followers"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs w-22"
                      onClick={() => {
                        handleFollow(user.userId);
                      }}
                      disabled={!!(userId && user.followers.find((f) => String(f) === userId))}
                    >
                      {userId &&
                      user.followers.find((f) => String(f) === userId)
                        ? "Following"
                        : "Follow"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DesktopSidebarRight;
