import { string } from "zod";
import { checkavailability, getAlltable } from "../reservation/route";
import { json } from "stream/consumers";
import prisma from "@/db";

export async function order(
  userid: number,
  date: string,
  partysize: string,
  price: number,
  menuitem: { menuItemid: string; manuItemname: string; menuitemqty: string }[],
  totalmenuquantity: number,
  slot: string
) {
  const gettabledata = await getAlltable(date);
  const isAvailable = await checkavailability(getAlltable, slot, date);
  if (!isAvailable) throw new Error("tabel unavailabel");
  try {
    const isorderd = prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userid,
          total: partysize,
        },
      });
      const orderid = order.id;
      const menuitems = menuitem.map((item) => {
        return {
          menuitmeid: item.menuItemid,
          manuItemname: item.manuItemname,
          menuitemqty: item.menuitemqty,
        };
      });

      await prisma.orderItem.create({
        data: {
          orderid: orderid,
          quantity: totalmenuquantity,
          price: price,
          menuitem: menuitems,
        },
      });
    });
    
  } catch (e) {
    throw new Error("order not placed")
  }
}
