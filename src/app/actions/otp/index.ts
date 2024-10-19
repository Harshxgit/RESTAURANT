"use server";
import { fail } from "assert";
import twilio from "twilio";
import schedule from "node-schedule";

let storedOTP: Record<string, string> = {};
const SECRET_KEY = process.env.CLOUDFLARE;
//rate limit
// const otpLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 3, // Limit each IP to 3 OTP requests per windowMs
//   message: "Too many requests, please try again after 5 minutes",
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

function deleteOtp(number: string) {
  delete storedOTP[number];
}

export async function sendOTP(to: string,token:string) {
  //cloud flare captach
  let formdata = new FormData();
  formdata.append("secret", SECRET_KEY??"");
  formdata.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formdata,
    method: "POST",
  });
  const isSucessed = (await result.json()).success;
  if (!isSucessed) {
    return { message: "Invalid reCAPTCHA token" };
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  deleteOtp(to);

  try {
    const expireTime = new Date(Date.now() + 5 * 60 * 1000);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    storedOTP[to] = otp;
    console.log(storedOTP);
    const result = await client.messages.create({
      body: `your otp is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+91" + to,
    });

    schedule.scheduleJob(expireTime, () => deleteOtp(to));

    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error };
  }
}

export async function verifyOtp(number: string, userotp: string) {
  if (storedOTP[number] === userotp) {
    console.log("true");
    return true;
  } else {
    console.log("false");
    return false;
  }
}
