import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { error } from "console";
import prisma from "@/db";
import { sendOTP, verifyOtp } from "@/app/actions/otp";
import { verify } from "crypto";
import { findUser } from "@/app/actions/user/userDetails";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        number: { label: "number", type: "text" },
        otp: { label: "Otp", type: "number" },
        password: { label: "Password", type: "password" },
        step: { label: "Step", type: "hidden" },
        mode: { label: "mode", type: "hidden" },
        token: { label: "token", type: "hidden" },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials) throw new Error("No credentials");

        const { number, otp, password, step, mode, } = credentials;

        try {
     

          if (mode === "login") {
            //sign in verify with otp
            const user = await findUser(number);
            if (!user) throw new Error("user not found");
            if (step === "otp") {
              const isVerified = await verifyOtp(number, otp);
              if (isVerified) return user;
              else throw new Error("please enter otp correctly ");
            }

            if (step === "password") {
              console.log("control reach here")
              console.log( user.password)
              const iscorrectpassword = await bcrypt.compare(
                password,
                user.password,
              );
              if (iscorrectpassword) return user;
              else throw new Error("password not matched");
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id?.toString(); // Convert ObjectId to string
        token.name = user.name;
        token.number = user.number;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.number = token.number;
      }
      return session;
    },
    
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
