"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPost } from "@/lib/apiResponse";
import {
  Bookmark,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Share,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";

// --- Add these imports for Shadcn Dialog ---
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import mongoose from "mongoose";
import UserContext from "@/context/user.context";
// --------------------------------------------

interface Post {
  postId : string
  avatar? : string
  file: string;
  caption: string;
  user: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: {
    userId: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt? : Date
}



export default function Feed() {
  const router = useRouter()
  const [Posts, setPosts] = useState<Post[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(UserContext)

  const name = context?.user?.name

  // --- Modal state ---
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [modalPreview, setModalPreview] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    const response = await apiGet<Post[]>("/api/post/getPosts");

    if (response.success) {
      setPosts(response.data);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- Modal handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    
    setFile(file || null);
    if (file) {
      setModalPreview(URL.createObjectURL(file));
    } else {
      setModalPreview(null);
    }
  };

  const handleCreatePost = async () => {
    const formData = new FormData();

    formData.append("file", file as File);
    formData.append("caption", caption as string);

    const toastId = toast.loading("Uploading...");

    // TODO: Implement post creation logic (API call)

    try {
      const response = await apiPost("/api/post/create", formData);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toast.dismiss(toastId);
      setOpen(false);
      setCaption("");
      setFile(null);
      setModalPreview(null);
      router.refresh()
    }
  };

  return (
    <div className="flex-1  max-w-3xl mx-auto relative px-2 sm:px-0">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 p-4 sticky top-0 z-40 rounded-t-xl box-border h-16">
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

      <ScrollArea className="h-[calc(100vh-70px)] lg:h-[calc(100vh-80px)]" style={{
        scrollbarWidth : "none"
      }}>

        {/* --- New Post Button (replaces old post box) --- */}
        <div className="bg-white border-b border-gray-200 p-2 sm:p-4 flex justify-between items-center">
          <div className="text-xl">Welcome <span className="text-purple-500 font-bold">{name?.split(" ")[0]}</span></div>
          <Button
            className="bg-purple-500 hover:bg-purple-600 rounded-full px-6"
            onClick={() => setOpen(true)}
          >
            <Send className="h-4 w-4 mr-1" />
            New Post
          </Button>
        </div>

        {/* --- Modal for Creating Post --- */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Image/Video</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                {modalPreview && (
                  <div className="mt-2">
                    {file?.type.startsWith("video") ? (
                      <video
                        src={modalPreview}
                        controls
                        className="w-full h-48 rounded-lg object-cover"
                      />
                    ) : (
                      <Image
                        src={modalPreview}
                        alt="Preview"
                        height={1000}
                        width={1000}
                        className="w-full h-48 rounded-lg object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="What's on your mind?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[100px] resize-none mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                className="bg-purple-500 hover:bg-purple-600"
                onClick={handleCreatePost}
                disabled={!caption && !file}
              >
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Posts List */}
        <div className="space-y-4 py-2">
          {Posts?.map((post, i) => (
            <Card key={i} className="rounded-xl border shadow-sm bg-white">
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} className="object-cover" />
                      <AvatarFallback>{post.user?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-md">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-purple-700">
                          {post.user}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{String(post.createdAt)}</span>
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
                {post.file && (
                  <div className="mb-3">
                    <Image
                      src={post.file}
                      width={1000}
                      height={1000}
                      alt="Post media"
                      className="h-96 w-auto object-cover rounded-lg"
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
            <div className="text-center text-gray-400 py-8">
              No posts found.
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Mobile bottom spacing */}
      <div className="h-8 lg:hidden" />
    </div>
  );
}
