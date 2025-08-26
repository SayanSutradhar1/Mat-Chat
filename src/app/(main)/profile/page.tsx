"use client";

import { logout } from "@/actions/logout.action";
import BottomNavbar from "@/components/Shared/BottomNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserContext from "@/context/user.context";
import { Post } from "@/interfaces/user.interface";
import { apiGet, apiPost } from "@/lib/apiResponse";
import { formatDate } from "@/lib/dateConvert";
import {
  ArrowLeft,
  Cake,
  Camera,
  Heart,
  LogOut,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Share
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  const [profilePictureDialogOpen, setProfilePictureDialogOpen] =
    useState(false);
  const [coverPhotoDialogOpen, setCoverPhotoDialogOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const context = useContext(UserContext);
  const router = useRouter()

  const user = context?.user;
  const setUser = context?.setUser;

  const fetchPosts = useCallback(async () => {
    try {
      const response = await apiGet("/api/user/getPostsByUserId");

      if (response.success) {
        if (setUser && user) {
          setUser({
            ...user,
            posts: response.data as Post[],
          });
        }
      } 
    } catch (error) {
      console.log(error);
      toast.error(
        (error as Error).message || "An error occurred while fetching posts"
      );
    }
  }, [user]);

  const handlePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    changeFile: Dispatch<SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      changeFile(file);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePicture) {
      toast.error("No picture is selected");
      return;
    }
    const toastId = toast.loading("Profile Picture Updating");
    try {
      const formData = new FormData();
      formData.append("picture", profilePicture);

      const response = await apiPost(
        "/api/user/updateProfilePicture",
        formData
      );

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toast.dismiss(toastId);
      setProfilePicture(null);
      setProfilePictureDialogOpen(false);
    }
  };

  const handleUpdateCoverPhoto = async () => {
    if (!coverPhoto) {
      toast.error("No Picture is Selected");
      return;
    }

    const toastId = toast.loading("Uploading Cover Image");
    try {
      const formData = new FormData();
      formData.append("picture", coverPhoto);
      const response = await apiPost("/api/user/updateCoverPhoto", formData);

      if (response.success) {
        toast.success("Cover Photo Updated Successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      toast.dismiss(toastId);
      setCoverPhoto(null);
      setCoverPhotoDialogOpen(false);
    }
  };

  const handleLogOut = async()=>{
    const toastId = toast.loading("Logging out...");
    try {
      const response = await logout()
      console.log(response);
      
      if(response.success) {
        toast.success("Logged out successfully");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging out");
    } finally {
      toast.dismiss(toastId);
      router.push("/login");
    }
  }

  useEffect(() => {
    if (user?.posts && user.posts.length > 0) {
      return;
    }
    fetchPosts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={handleLogOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Picture Update Dialog */}
      <Dialog
        open={profilePictureDialogOpen}
        onOpenChange={setProfilePictureDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {user?.avatar && !profilePicture && (
              <Image
                width={1000}
                height={1000}
                src={user.avatar}
                alt="Current Profile"
                className="w-full h-64 rounded-lg object-cover mb-4"
              />
            )}
            <div>
              <Label htmlFor="file-upload">Image</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handlePictureChange(e, setProfilePicture)}
                className="cursor-pointer"
              />
              {profilePicture && (
                <div className="mt-2">
                  <Image
                    width={1000}
                    height={1000}
                    src={URL.createObjectURL(profilePicture)}
                    alt="Preview"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="ghost"
                onClick={() => {
                  setProfilePicture(null);
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
              onClick={handleUpdateProfilePicture}
              disabled={!profilePicture}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cover Photo Update Dialog */}
      <Dialog
        open={coverPhotoDialogOpen}
        onOpenChange={setCoverPhotoDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Cover Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {user?.coverPhoto && !coverPhoto && (
              <Image
                width={1000}
                height={1000}
                src={user.coverPhoto}
                alt="Current Profile"
                className="w-full h-64 rounded-lg object-cover mb-4"
              />
            )}
            <div>
              <Label htmlFor="file-upload">Image</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handlePictureChange(e, setCoverPhoto)}
                className="cursor-pointer"
              />
              {coverPhoto && (
                <div className="mt-2">
                  <Image
                    width={1000}
                    height={1000}
                    src={URL.createObjectURL(coverPhoto)}
                    alt="Preview"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="ghost"
                onClick={() => {
                  setCoverPhoto(null);
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
              onClick={handleUpdateCoverPhoto}
              disabled={!coverPhoto}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-6 pb-20 lg:pb-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            {/* Cover Photo */}

            <div className="relative h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg mb-6">
              {user?.coverPhoto && (
                <Image
                  src={user.coverPhoto}
                  height={1000}
                  width={1000}
                  alt="Cover"
                  className="absolute top-0 h-full w-full opacity-90 object-cover rounded-lg"
                />
              )}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border-white/30"
                onClick={() => setCoverPhotoDialogOpen(true)}
              >
                <Camera className="h-4 w-4 mr-2" />
                Edit Cover
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-col md:flex-row md:items-end md:justify-between -mt-20 relative">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar
                    className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-white shadow-lg cursor-pointer relative z-30"
                    onClick={() => {
                      setProfilePictureDialogOpen(true);
                    }}
                  >
                    <AvatarImage src={user?.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl">
                      {user?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <p className="text-gray-600">@{user?.username}</p>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user?.location || "India"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Cake className="h-4 w-4" />
                      <span>
                        {user?.dateOfBirth &&
                          formatDate(user?.dateOfBirth, "date")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <p className="text-gray-700 mb-4">
                {user?.bio ||
                  `Hey there 👋 I'm ${user?.name}, a full-stack developer passionate about building amazing web applications. Let's connect!`}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-8 gap-4 sm:gap-0 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user?.followers.length}
                </div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user?.following.length}
                </div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user?.posts?.length ?? 0}
                </div>
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
                      {post.file && (
                        <Image
                          width={1000}
                          height={1000}
                          src={post.file || "/placeholder.svg"}
                          alt="Post image"
                          className="w-full max-w-md rounded-lg mb-4"
                        />
                      )}
                      <div className="flex items-center space-x-6 text-gray-500">
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes.length}</span>
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
            {user?.posts?.length === 0 && (
              <div className="text-center text-2xl text-gray-500 w-full py-10">
                No Posts
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user?.posts &&
                user.posts.map((user, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={user.file ?? `/placeholder.svg?height=200&width=200`}
                      alt={`Media ${i}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>
            {user?.posts?.length === 0 && (
                <div className="text-center text-2xl text-gray-500 w-full py-6">
                  No Files
                </div>
              )}
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            {/* <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Bio
                  </Label>
                  <p className="mt-1 text-gray-600">
                    Full-stack developer passionate about creating amazing user
                    experiences. Love to travel, photography, and good coffee ☕
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Location
                    </Label>
                    <p className="mt-1 text-gray-600">San Francisco, CA</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <p className="mt-1 text-purple-600">johndoe.dev</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Joined
                    </Label>
                    <p className="mt-1 text-gray-600">March 2023</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Languages
                    </Label>
                    <p className="mt-1 text-gray-600">
                      English, Spanish, French
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            <div className="text-center text-2xl text-gray-500 w-full py-10">
              Under Construction
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* <div className="grid gap-4">
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
                      <p className="text-sm text-gray-500">
                        Who can see your profile
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Public
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Message Requests</Label>
                      <p className="text-sm text-gray-500">
                        Who can message you
                      </p>
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
                      <p className="text-sm text-gray-500">
                        Receive notifications on your device
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
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
                      <p className="text-sm text-gray-500">
                        Choose your preferred theme
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Light
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Language</Label>
                      <p className="text-sm text-gray-500">
                        Select your language
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      English
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div> */}
            <div className="text-center text-2xl text-gray-500 w-full py-10">
              Under Construction
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Mobile Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}
