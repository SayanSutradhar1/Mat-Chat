import LoginForm from "@/components/Auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm order-1 lg:order-2">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>Join the conversation today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <LoginForm />
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
