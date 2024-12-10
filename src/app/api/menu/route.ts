import { addMenu, getMenu } from "@/app/actions/menu/addMenu";
import {prisma} from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getMenu();
    if (!data) return Response.json({ error: "menu data not found" });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch data" },
      { status: 404 }
    );
  }
}

export async function POST(req: Request) {
  const { name, price, description, category } = await req.json();
  if (!name || !price || !description || !category)
    return NextResponse.json({ error: "data not found" }, { status: 404 });
  try {
    const insertdata = await addMenu(name, price, description, category);
    if (!insertdata)
      return NextResponse.json({ error: "data not found" }, { status: 404 });
    return NextResponse.json(insertdata, { status: 202 });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 404 });
  }
}

export async function PUT(req: Request) {
  const { name, price, description, id, category } = await req.json();
  if (!name || !price || !description || !category || !id)
    return NextResponse.json({ error: "data not found" });
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
  return NextResponse.json({ message: "data updated" });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const del = await prisma.menuItem.delete({
    where: {
      id: id,
    },
  });
  if (!del) return NextResponse.json({ message: "faild to delete menu" });
  return NextResponse.json({ message: "menu deleted" });
}
