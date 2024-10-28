import { string } from "zod";
import { json } from "stream/consumers";
import prisma from "@/db";

export async function order(
  userid: number,
  partysize: number,
  price: number,
  menuitem: { menuItemid: string; menuItemname: string; menuitemqty: string }[],
  totalmenuquantity: number
) {
  try {
    const isorderd = prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userid,
          partysize: partysize,
        },
      });
      const  orderid = order.id;
      console.log(orderid);

      await tx.orderItem.create({
        data: {
          orderid: orderid,
          quantity: totalmenuquantity,
          price: price,
          menuitem: menuitem,
        },
      });
    });
    if (!isorderd) return { message: "failed to order not placed" };
    return { message: "order placed" };
  } catch (e) {
    throw new Error("order not placed");
  }
}
