import React from "react";
import { Card, CardContent } from "../ui/card";
import { TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const DesktopSidebarRight = () => {
  const suggestedUsers = [
    {
      name: "Alex Rodriguez",
      username: "@alexr",
      avatar: "/placeholder.svg?height=32&width=32",
      followers: "2.3K",
      mutual: 5,
    },
    {
      name: "Lisa Park",
      username: "@lisap",
      avatar: "/placeholder.svg?height=32&width=32",
      followers: "1.8K",
      mutual: 3,
    },
    {
      name: "David Kim",
      username: "@davidk",
      avatar: "/placeholder.svg?height=32&width=32",
      followers: "5.1K",
      mutual: 8,
    },
  ];

  const trendingTopics = [
    { tag: "#ReactJS", posts: "12.5K" },
    { tag: "#WebDev", posts: "8.9K" },
    { tag: "#AI", posts: "15.2K" },
    { tag: "#Design", posts: "6.7K" },
    { tag: "#Startup", posts: "4.3K" },
  ];

  return (
    <div className="hidden xl:block w-80 bg-white border-l border-gray-200 h-screen sticky top-0">
      <div className="p-4 space-y-6">
        {/* Trending Topics */}
        <Card>
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
        </Card>

        {/* Suggested Users */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Suggested for you
            </h3>
            <div className="space-y-3">
              {suggestedUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.followers} followers • {user.mutual} mutual
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DesktopSidebarRight;
