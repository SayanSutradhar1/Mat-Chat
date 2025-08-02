import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { UserCredentials } from "./models/user.model";
import { compare } from "bcryptjs";
import { connectDB } from "./lib/db.connect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialProvider({
      name: "credential",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email) {
          throw new CredentialsSignin("Email is required", {
            cause: "Email is required",
          });
        }

        if (!password) {
          throw new CredentialsSignin("Email is required", {
            cause: "Email is required",
          });
        }

        console.log(credentials);
        

        try {
          await connectDB();
          const user = await UserCredentials.findOne({ email }).select("+password");



          if (!user) {
            throw new CredentialsSignin("User Not found", {
              cause: "User Not found",
            });
          }

          const isMatch = await compare(password, user.password);

          if (!isMatch)
            throw new CredentialsSignin("Incorrect Password", {
              cause: "Incorrect Password",
            });

          return {
            userId : user.userId,
            email : user.email,
            name : user.name,
          };
        } catch (error) {
          console.log(error);
          
          throw new Error("Something went wrong", {
            cause: (error as Error).message,
          });
        }
      },
    }),
  ],
  pages: {
    signIn : "/login"
  },
});
