import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const page = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm order-1 lg:order-2">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify Email</CardTitle>
        <CardDescription>OTP Sent to your Email</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center">
          <InputOTP maxLength={6} pattern={"^\\d+$"}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-center mt-3">
            <Button className="mx-auto">Verify</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default page;
