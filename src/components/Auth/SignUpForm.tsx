"use client";

import { signup } from "@/actions/signup.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SignUpForm = () => {
  const [signupCredentials, setSignupCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
  });
  const router = useRouter();

  const handleSubmit = async () => {
    const toastId = toast.loading("Creating...");
    try {
      const response = await signup(signupCredentials);

      if (response.success) {
        toast.success(response.message);
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    } finally {
      toast.dismiss(toastId);
      setSignupCredentials({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        username: "",
      });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            value={signupCredentials.firstName}
            onChange={(e) => {
              setSignupCredentials({
                ...signupCredentials,
                firstName: e.target.value,
              });
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={signupCredentials.lastName}
            onChange={(e) => {
              setSignupCredentials({
                ...signupCredentials,
                lastName: e.target.value,
              });
            }}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="@johndoe"
          value={signupCredentials.username}
          onChange={(e) => {
            setSignupCredentials({
              ...signupCredentials,
              username: e.target.value,
            });
          }}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupEmail">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          placeholder="john@example.com"
          value={signupCredentials.email}
          onChange={(e) => {
            setSignupCredentials({
              ...signupCredentials,
              email: e.target.value,
            });
          }}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupPassword">Password</Label>
        <Input
          id="signupPassword"
          type="password"
          placeholder="Create a password"
          value={signupCredentials.password}
          onChange={(e) => {
            setSignupCredentials({
              ...signupCredentials,
              password: e.target.value,
            });
          }}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        // disabled={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
