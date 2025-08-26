"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import UserContext from "./user.context";
import { apiGet } from "@/lib/apiResponse";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interface";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();

  const getUser = useCallback(async () => {
    try {
      const response = await apiGet<User>("/api/user/getUserByEmail");
      console.log(response);

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "An error occurred while fetching user data"
      );
    }
  }, [user]);

  useEffect(() => {
    getUser();
  }, []);

  // Here you would typically fetch user data from an API or context
  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider
