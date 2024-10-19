"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { promises } from "dns";
export async function findUser(number: string) {
  const user = await prisma.user.findUnique({
    where: { number: number },
  });
  return user;
}

type FormState = {
  firstname?: string;
  lastname?: string;
  password?: string;
  number?: string;
  sucess?: boolean;
  error?: string;
};

export async function setUserAdress(
  prevState: FormState | null,
  FormData: FormData
): Promise<FormState|never> {
  const firstname = FormData.get("firstname") as string;
  const lastname = FormData.get("lastname") as string;
  const number = FormData.get("number") as string;
  const password = FormData.get("password") as string;
  const hashpassword =await bcrypt.hash(password , 10)
  try {
    const usercreate = await prisma.user.create({
      data: {
        name: firstname + lastname,
        number: number,
        password: hashpassword,
      },
    });
    if (usercreate) {
      revalidatePath("/signup");
      return {sucess: true}
    } else {
      return { error: "Data not submitted" };
    }
  } catch (error) {
    return { error: "fail" };
  }
}
