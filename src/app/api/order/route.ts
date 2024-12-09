import { order } from "@/app/actions/order/order";
import prisma from "@/db";
import { NextResponse } from "next/server";
//place order function
export async function POST(req: Request) {
  const { userid, partysize, price, menuitem, totalmenuquantity, ordertype } =
    await req.json();
  if (
    !userid ||
    !partysize ||
    !price ||
    !menuitem ||
    !totalmenuquantity ||
    !ordertype
  )
    return NextResponse.json({ message: "not credentials" });

  const ordernow = await order(
    userid,
    partysize,
    price,
    menuitem,
    totalmenuquantity,
    ordertype
  );
  if (!ordernow) return Response.json({ message: ordernow });
  return NextResponse.json(ordernow);
}

export async function GET() {
  try {
    const allorders = await prisma.order.findMany({
      include: {
        item: true,
      },
    });
    return NextResponse.json(allorders);
  } catch (e) {
    throw new Error("user can't find it");
  }
}

//see all order , i will do it use it websocket
