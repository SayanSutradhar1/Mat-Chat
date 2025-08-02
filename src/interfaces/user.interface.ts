export interface User {
  userId: string;
  name: string;
  bio: string;
  avatar: string;
  dateOfBirth: Date | undefined;
  location: string;
  following: any[];
  followers: any[];
  posts?: Post[];
}

export interface Post {
  postId: string;
  userId: string;
  picture: string;
  caption: string;
  likes: any[];
  comments: {
    userId: string;
    content: string;
    createdAt: Date;
  }[];
}
