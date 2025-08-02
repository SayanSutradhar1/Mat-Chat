"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import UserContext from "@/context/user.context";
import { ApiResponse } from "@/interfaces/api.interface";
import { apiGet } from "@/lib/apiResponse";
import axios from "axios";
import {
  Bookmark,
  Filter,
  Heart,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Share,
  Smile,
  Video,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";

interface Post {
  picture: string;
  caption: string;
  user: string;
  likes: any[];
  comments: {
    userId: string;
    content: string;
    createdAt: Date;
  }[];
}

export default function Feed() {
  const context = useContext(UserContext);

  const [Posts, setPosts] = useState<Post[]>();
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchPosts = useCallback(async () => {
    const response = await apiGet<any>("/api/post/getPosts")

    if (response.success) {
      setPosts(response.data);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex-1 max-w-2xl mx-auto relative px-2 sm:px-0">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 p-4 sticky top-0 z-40 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-700">News Feed</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                className="pl-10 w-64 rounded-full border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden p-4 bg-white border-b border-gray-200 sticky top-0 z-40 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-purple-700">Feed</h2>
          <div className="relative w-2/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 rounded-full border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)] lg:h-[calc(100vh-160px)]">
        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-2 sm:p-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {["all", "post", "video", "news", "design"].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "ghost"}
                size="sm"
                className={`whitespace-nowrap rounded-full px-4 py-1 text-xs ${
                  activeFilter === filter
                    ? "bg-purple-500 text-white"
                    : "text-gray-700 hover:bg-purple-100"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* New Post Box */}
        <div className="bg-white border-b border-gray-200 p-2 sm:p-4">
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {context?.user?.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[60px] resize-none border-none shadow-none focus-visible:ring-0 p-0 rounded-xl bg-gray-50"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Photo</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Video className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Video</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Smile className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Emoji</span>
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600 rounded-full px-6"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4 py-2">
          {Posts?.map((post, i) => (
            <Card
              key={i}
              className="rounded-xl border shadow-sm bg-white"
            >
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.picture || "/placeholder.svg"} />
                      <AvatarFallback>
                        {post.user?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm text-purple-700">{post.user}</h3>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{post.user}</span>
                        <span>•</span>
                        <span>{post.caption?.slice(0, 20)}...</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="mb-3">
                  <p className="text-gray-800 text-sm leading-relaxed break-words">
                    {post.caption}
                  </p>
                </div>

                {/* Post Media */}
                {post.picture && (
                  <div className="mb-3">
                    <img
                      src={post.picture}
                      alt="Post media"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes?.length ?? 0}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments?.length ?? 0}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
                      <Share className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-purple-500 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!Posts || Posts.length === 0) && (
            <div className="text-center text-gray-400 py-8">No posts found.</div>
          )}
        </div>
      </ScrollArea>
      {/* Mobile bottom spacing */}
      <div className="h-8 lg:hidden" />
    </div>
  );
}