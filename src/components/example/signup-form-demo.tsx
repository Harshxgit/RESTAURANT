"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Turnstile } from "@marsidev/react-turnstile";
import { useFormState, useFormStatus } from "react-dom";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { sendOTP, verifyOtp } from "@/app/actions/otp";
import { findUser, setUserAdress } from "@/app/actions/user/userDetails";
import { useRouter } from "next/navigation";

export default function SignupFormDemo() {
  const { pending } = useFormStatus();
  const router = useRouter();

  //states
  const [number, setNumber] = useState("");
  const [isotpverfied, setOtpverified] = useState(false);
  const [message, setMessage] = useState("");
  const [otp, setotp] = useState("");
  const [token, setToken] = useState("");
  const [state, formAction] = useFormState(setUserAdress, null);

  useEffect(() => {
    if (state?.sucess) {
      router.push("/sign-in");
    }

    const verify = async () => {
      if (otp.length == 6) {
        const verify = await verifyOtp(number, otp);

        if (verify) {
          setOtpverified(true);
          setMessage("otp verified!");
        } else {
          setMessage("please enter valid otp");
          setOtpverified(false);
        }
      }
    };
    verify();
  }, [otp, state, router]);

  // const handlesumbit = (e: { preventDefault: () => void; })=>{
  //     e.preventDefault()

  // }

  //send otp server action function
  const sendotp = async (e: { preventDefault: () => void }) => {
    //check user exist or not
    const existuser = await findUser(number);
    if (existuser) return setMessage("user already exist");
    console.log("otp sent");
    await sendOTP(number, token);
    setMessage("!OTP Sent");
    e.preventDefault();
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <>
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Our Restaurant
        </h2>
        <form className="my-8" action={formAction}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="first-name"
                type="text"
                name="firstname"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="last-name"
                type="text"
                name="lastname"
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="text">Enter your Phone number</Label>
            <div className="flex space-x-6">
              <Input
                id="number"
                placeholder="9341******"
                type="text"
                onChange={(e) => setNumber(e.target.value)}
                name="number"
                required
              />
              <button
                className="border-2 rounded-xl bg-green-600 px-1 relative"
                onClick={sendotp}
              >
                Send Otp
              </button>
            </div>
            <li className="text-green-500 list-none">{message}</li>
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="number">Enter otp</Label>
            <Input
              id="otp"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setotp(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Your password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              name="password"
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            aira-disabled={pending}
          >
            {pending ? "Signing up" : "Sign up"} &rarr;
            <BottomGradient />
          </button>
          <Turnstile
            className="my-4 mx-1"
            onSuccess={(token) => {
              setToken(token);
            }}
            siteKey="0x4AAAAAAAwsPtO1RkLb-vFz"
          />
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
