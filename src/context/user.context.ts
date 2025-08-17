"use client"
import { User } from "@/interfaces/user.interface";
import { createContext, Dispatch, SetStateAction } from "react";

export interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const UserContext = createContext<UserContextType | undefined>({
  user: {} as User,
  setUser: () => {}, // Default empty function
});

export default UserContext;
