import { reserveNow } from "@/app/actions/reservation/reservation";

export async function POST(req: Request) {
  const {
    userid,
    date,
    time,
    partysize,
    tableid,
    order,
    price,
    menuitem,
    totalmenuquantity,
    username,
    ordertype,
  } = await req.json();

  const isreserve = reserveNow(
    userid,
    date,
    time,
    partysize,
    tableid,
    menuitem,
    totalmenuquantity,
    price,
    username,
    ordertype
  );
  if (order) {
    const ordernow = await order(
      userid,
      partysize,
      price,
      menuitem,
      totalmenuquantity
    );
  }
  if (!isreserve) return Response.json(isreserve);
  return Response.json(isreserve);
}
