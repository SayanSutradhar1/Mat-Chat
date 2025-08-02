"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  LinkIcon,
  MessageCircle,
  Phone,
  Video,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Share,
  Settings,
  Shield,
  Bell,
  Palette,
  Home,
  Plus,
  User,
} from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/apiResponse"
import { Post } from "@/interfaces/user.interface"
import toast from "react-hot-toast"
import UserContext from "@/context/user.context"

const posts = [
  {
    id: 1,
    content: "Just finished an amazing project! Feeling grateful for the amazing team I work with. 🚀",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    content: "Beautiful sunset from my evening walk. Nature never fails to amaze me! 🌅",
    timestamp: "1 day ago",
    likes: 45,
    comments: 12,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    content: "Excited to share that I'll be speaking at the upcoming tech conference next month!",
    timestamp: "3 days ago",
    likes: 67,
    comments: 23,
  },
]

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  const context = useContext(UserContext)

  const user = context?.user
  const setUser = context?.setUser


  const fetchPosts = useCallback(async ()=>{
    try {
      const response = await apiGet("/api/user/getPostsByUserId");

      if(response.success) {
        toast.success("Posts fetched successfully");
        if(setUser && user) {
          setUser({
            ...user,
            posts: response.data as Post[]
          })
        }
        
      } else {
        toast.error(response.message || "Failed to fetch posts");
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "An error occurred while fetching posts");
    }
  },[user])


  useEffect(()=>{
    if(user?.posts && user.posts.length > 0) {
      return;
    }
    fetchPosts();
  },[user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-6 pb-20 lg:pb-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            {/* Cover Photo */}
            <div className="relative h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg mb-6">
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30"
              >
                <Camera className="h-4 w-4 mr-2" />
                Edit Cover
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-col md:flex-row md:items-end md:justify-between -mt-20 relative">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 h-8 w-8 rounded-full p-0 bg-purple-500 hover:bg-purple-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                  <p className="text-gray-600">@johndoe</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined March 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Message</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Video className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Video</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <p className="text-gray-700 mb-4">
                Full-stack developer passionate about creating amazing user experiences. Love to travel, photography,
                and good coffee ☕
              </p>
              <div className="flex items-center space-x-1 text-purple-600">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="hover:underline">
                  johndoe.dev
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-8 gap-4 sm:gap-0 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user?.followers.length}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user?.following.length}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user?.posts?.length ?? 0}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              {/* <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">89</div>
                <div className="text-sm text-gray-500">Chats</div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {user?.posts?.map((post) => (
              <Card key={post.postId}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">John Doe</h3>
                        {/* <span className="text-sm text-gray-500">{post.timestamp}</span> */}
                      </div>
                      <p className="text-gray-700 mb-4">{post.caption}</p>
                      {post.picture && (
                        <img
                          src={post.picture || "/placeholder.svg"}
                          alt="Post image"
                          className="w-full max-w-md rounded-lg mb-4"
                        />
                      )}
                      <div className="flex items-center space-x-6 text-gray-500">
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments.length}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                          <Share className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=200&width=200`}
                    alt={`Media ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bio</Label>
                  <p className="mt-1 text-gray-600">
                    Full-stack developer passionate about creating amazing user experiences. Love to travel,
                    photography, and good coffee ☕
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Location</Label>
                    <p className="mt-1 text-gray-600">San Francisco, CA</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Website</Label>
                    <p className="mt-1 text-purple-600">johndoe.dev</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Joined</Label>
                    <p className="mt-1 text-gray-600">March 2023</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Languages</Label>
                    <p className="mt-1 text-gray-600">English, Spanish, French</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-gray-500">Who can see your profile</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Public
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Message Requests</Label>
                      <p className="text-sm text-gray-500">Who can message you</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Everyone
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications on your device</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Disabled
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Appearance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Light
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Language</Label>
                      <p className="text-sm text-gray-500">Select your language</p>
                    </div>
                    <Button variant="outline" size="sm">
                      English
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50">
        <div className="flex items-center justify-around">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
              <Home className="h-5 w-5" />
              <span className="text-xs">Feed</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Chat</span>
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-purple-500">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
