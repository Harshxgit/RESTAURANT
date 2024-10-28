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

export async function GET(orderid:number) {
  const allorders = await prisma.order.findUnique({
    where:{
      id :orderid
    },
    include:{
      item:true
    }
  });
  return Response.json( allorders );
}

//see all order , i will do it use it websocket
