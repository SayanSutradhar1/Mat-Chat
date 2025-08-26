import mongoose from "mongoose";

export interface User {
  username : string
  userId: string;
  name: string;
  bio: string;
  avatar: string;
  coverPhoto? : string
  dateOfBirth: Date | undefined;
  location: string;
  following: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  posts?: Post[];
  joinedAt? : string
}

export interface Post {
  postId: string;
  userId: string;
  file: string;
  caption: string;
  likes: {
    userId : string;
    name : string
    avatar : string
  }[];
  comments: {
    userId: string;
    content: string;
    createdAt: Date;
  }[];
}
