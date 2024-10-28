import { reserveNow } from "@/app/actions/reservation/reservation";

export async function POST(req: Request) {
  const { userid, date, time, partysize, tableid } = await req.json();
  const isreserve = reserveNow(userid, date, time, partysize, tableid);
  if (!isreserve) return Response.json(isreserve);
  return Response.json(isreserve);
}
