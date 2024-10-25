import { addMenu, getMenu } from "@/app/actions/menu/addMenu";
import prisma from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(request: Request) {
  try {
    const data = await getMenu();
    if (!data) return Response.json({ error: "menu data not found" });
    return Response.json(data);
  } catch (error) {
    Response.json({ error: "failed to fetch data" });
  }
}

export async function POST(req: Request) {
  const { name, price, description, category } = await req.json();
  if (!name || !price || !description || !category)
    return Response.json({ error: "data not found" });
  try {
    const insertdata = await addMenu(name, price, description, category);
    if (!insertdata) return Response.json({ error: "data not found" });
    return Response.json({ message: "data inserted" });
  } catch (e) {
    return Response.json({ error: "failed" });
  }
}
export async function PUT(req: Request) {
  const { name, price, description, id, category } = await req.json();
  if (!name || !price || !description || !category || !id)
    return Response.json({ error: "data not found" });
  const update = await prisma.menuItem.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      price: price,
      description: description,
      category: category,
    },
  });
  if (!update) return Response.json({ message: "update failed" });
  return Response.json({ message: "data updated" });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const del = await prisma.menuItem.delete({
    where: {
      id: id,
    },
  });
  if (!del) return Response.json({ message: "faild to delete menu" });
  return Response.json({ message: "menu deleted" });
}
