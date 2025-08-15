
export interface UserCreateBody {
  name: string;
  username?: string;
  email: string;
  password: string;
}

export interface PostCreateBody {
  userId : string
  picture? : string
  caption? : string
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error? : string
}
