import { order } from "@/app/actions/order/order";
import prisma from "@/db";

//place order function
export async function POST(req: Request) {
  const { userid, partysize, price, menuitem, totalmenuquantity } =
    await req.json();
  if (!userid || !partysize || !price || !menuitem || !totalmenuquantity)
    return { message: "not credentials" };

  const ordernow = await order(
    userid,
    partysize,
    price,
    menuitem,
    totalmenuquantity
  );
  if (!ordernow) return Response.json({ message: ordernow });
  return Response.json(ordernow);
}

export async function GET() {
  try {
    const allorders = await prisma.order.findMany({
      include: {
        item: true,
      },
    });
    return Response.json(allorders);
  } catch (e) {
    throw new Error("user can't find it");
  }
}

//see all order , i will do it use it websocket
