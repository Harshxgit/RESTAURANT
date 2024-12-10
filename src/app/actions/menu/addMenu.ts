'use server'
import {prisma} from "@/db/index";
import { error } from "console";
import { Manifest } from "next/dist/lib/metadata/types/manifest-types";

export async function addMenu(
  MenuName: string,
  price: number,
  description: string,
  category: string
) {
  const name = await prisma.menuItem.findUnique({
    where: {
      name: MenuName,
    },
  });
  console.log("control here")
  if (name) return { message: "this item is existed" };
  try {
    const data = await prisma.menuItem.create({
      data: {
        name: MenuName,
        price: price,
        description: description,
        category: category,
      }
    });
    if (!data) return { "message": "failed to add" };
    return {"message":"menu added"}
  } catch (error) {
    console.error("error");
  }
}

export async function getMenu(): Promise<
  {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[]
> {
  return await prisma.menuItem.findMany({});
}

export async function updateMenu(
  id: number,
  MenuName: string,
  price: number,
  description: string,
  category: string
) {
  try {
    const update = await prisma.menuItem.update({
      where: {
        id: id,
      },
      data: {
        name: MenuName,
        price: price,
        description: description,
        category: category,
      },
    });
    if (update) return { message: "menu updated" };
  } catch (error) {
    console.log(error);
  }
}
export async function deleteMenu(id: number) {
  try {
    const deleteMenu = await prisma.menuItem.delete({
      where: { id: id },
    });
    if (deleteMenu) return { message: "menu deleted sucessfully" };
  } catch (e) {
    console.log(e);
  }
}
