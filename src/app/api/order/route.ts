import { order } from "@/app/actions/order/order";
import prisma from "@/db";

export async function POST(req: Request) {
  const {
    userid,
    partysize,
    price,
    menuitem,
    totalmenuquantity,
    } = await req.json();
  if (
    !userid ||
    !partysize ||
    !price ||
    !menuitem ||
    !totalmenuquantity
  )
    return { message: "not credentials" };

  const ordernow = await order(
    userid,
    menuitem,
    totalmenuquantity,
    price,
    menuitem,
  );
  if (!ordernow) return Response.json({ message: ordernow });
  return Response.json(ordernow);
}

export async function GET() {
  return Response.json({ ordernow: "hello harshu" });
}
