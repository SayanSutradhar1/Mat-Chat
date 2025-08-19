import SignUpForm from "@/components/Auth/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const SignUp = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm order-1 lg:order-2 px-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>Join the conversation today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <SignUpForm />
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Log In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUp;
