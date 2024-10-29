import { reserveNow } from "@/app/actions/reservation/reservation";
import next from "next";

export async function POST(req: Request) {
  const { userid, date, time, partysize, tableid ,order ,  price, menuitem, totalmenuquantity} = await req.json();
  const isreserve = reserveNow(userid, date, time, partysize, tableid);
  if(order){
    const ordernow = await order(userid,partysize,price,menuitem,totalmenuquantity)
    if(ordernow) next
  }
  if (!isreserve) return Response.json(isreserve);
  return Response.json(isreserve);
}
 