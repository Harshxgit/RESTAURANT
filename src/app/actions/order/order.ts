import { string } from "zod";
import { json } from "stream/consumers";
import prisma from "@/db";

export async function order(
  userid: number,
  partysize: string,
  price: number,
  menuitem: { menuItemid: string; menuItemname: string; menuitemqty: string }[],
  totalmenuquantity: number,

) {
 
  try {
    const isorderd = prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userid,
          total: partysize
        }
      });
      const orderid = order.id;
      const menuitems = menuitem.map((item) => {
        return {
          menuitmeid: item.menuItemid,
          manuItemname: item.menuItemname,
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
    if(!isorderd) return {"message":"failed to order not placed"}
     return {"message":"order placed"}
  } catch (e) {
    throw new Error("order not placed")
  }
}
