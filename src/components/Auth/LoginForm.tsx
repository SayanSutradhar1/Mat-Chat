"use client";

import { login } from "@/actions/login.action";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [loginCredentials, setLoginCredentails] = useState({
    email: "",
    password: "",
  });

  const router = useRouter()

  const handleSubmit = async () => {

    if(loginCredentials.email === "" || loginCredentials.password === "") {
      toast.error("Please fill all fields");
      return;
    }

    const toastId = toast.loading("Logging in...");
    try {
      const response = await login(loginCredentials);

      if (response.success) {
        toast.success("Logged in Successfully");
        router.push("/feed")
      } else {
        toast.error("Failed to login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={loginCredentials.email}
          onChange={(e) =>
            setLoginCredentails({
              ...loginCredentials,
              email: e.target.value,
            })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={loginCredentials.password}
          onChange={(e) =>
            setLoginCredentails({
              ...loginCredentials,
              password: e.target.value,
            })
          }
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer"
        disabled={isLoading}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
