"use client";
import React, { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import validator from "validator";
import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { findUser } from "@/app/actions/userDetails";
import { sendOTP, verifyOtp } from "@/app/actions/otp";
const schema = z.object({
  phone: z.string().refine(validator.isMobilePhone),
});

export default function page() {
  const router = useRouter();
  const [password,setPassword] = useState("")
  const [number, setNumber] = useState<string>("0");
  const [currentstep, setCurrentStep] = useState<string | undefined>("number");
  const [isLogin, SetIslogin] = useState(false);
  const [right, setRight] = useState<boolean>(false);

  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();

  const login = async () => {
    if (currentstep === "otp") {
      const response = await signIn("credentials", {
        mode: "login",
        number: number,
        step: currentstep,
        redirect: true,
      });
      if (response) setMessage("signin sucessfully");
    } else if (currentstep === "password") {
      const response = await signIn("credentials", {
        mode: "login",
        number: number,
        password:password,
        step: currentstep,
        redirect: true,
      });
      if (response) setMessage("signin sucessfully");
    }
  };

  const sendotp = async (e: { preventDefault: () => void }) => {
    //check user exist or not
    const existuser = await findUser(number);
    if (!existuser) {
      setMessage("user not found");
      router.push("/signup");
    }
    console.log("otp sent");
    await sendOTP(number, token);
    setMessage("!OTP Sent");
    setCurrentStep("otp");
    SetIslogin(true);
    e.preventDefault();
  };
  useEffect(() => {
    const sucess = (number: string) => {
      if (number.length !== 10) setRight(false);
      else setRight(true);
      const check = schema.safeParse({
        phone: number,
      });

      console.log(check);
    };

    sucess(number);
  }, [number]);
  return (
    <>
      {session?.user.name && session.user.number}
      <div className="flex flex-col bg-black h-screen items-center justify-center ">
        {currentstep === "number" && (
          <div className="relative m-2">
            <label
              htmlFor="name"
              id="number"
              className="leading-7 text-sm text-gray-600"
            >
              <div className="text-red-500"> {error}</div>
              Enter your number
            </label>
            <input
              type="text"
              id="number"
              name="phone number"
              className={`w-full border-4 bg-gray-100 bg-opacity-50 rounded  border-gray-300 ${
                right ? "focus:border-green-500 " : "focus:border-red-500"
              } focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        )}
        {message}
        {(currentstep === "otp" || currentstep === "password") && (
          <div className="relative">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Enter your {currentstep}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col">
            <button onClick={sendotp}>login with otp</button>
            <button
              onClick={async () => {
                const existuser = await findUser(number);
                if (!existuser) {
                  setMessage("user not found");
                  router.push("/signup");
                }
                setCurrentStep("password");
                SetIslogin(true);
              }}
            >
              login with password
            </button>
          </div>
        )}
        <button onClick={() => signOut()}>sign out</button>
        {isLogin && (
          <button className="border-2 bg-green-600 m-4" onClick={login}>
            LOGIN
          </button>
        )}
        <Turnstile
          className="my-4 mx-1"
          onSuccess={(token) => {
            setToken(token);
          }}
          siteKey="0x4AAAAAAAwsPtO1RkLb-vFz"
        />
      </div>
    </>
  );
}
