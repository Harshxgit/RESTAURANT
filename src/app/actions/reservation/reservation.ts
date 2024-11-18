import prisma from "@/db";
import { getIO } from "../../../../server/socket";
import { order } from "../order/order";
// import cron from "node-cron";
//resete function for reset all table for tomorrow leaving this reserver table


const io = getIO();
//main reservation function
export async function reserveNow(
  userid: number,
  date: Date,
  time: string,
  partysize: number,
  tableid: number,
  username: string,
  menuitem: { menuItemid: string; menuItemname: string; menuitemqty: string }[],
  totalmenuquantity: number,
  price : number
) {
  try {
    // const gettabledata = await getAlltable(date);
    // const isAvailable = await checkavailability(gettabledata, time, date);
    // if (!isAvailable) throw new Error("tabel unavailabel");
    const isreserve = prisma.$transaction(async (tx) => {
      await tx.reservation.create({
        data: {
          userId: userid,
          date: date,
          partysize: partysize,
          TableId: tableid,
          time: time,
        },
      });
      if(!!menuitem){
        order(userid,partysize,totalmenuquantity,price,menuitem)
      }
    });

    
    if (!isreserve) return Response.json({ message: "failed to reserve" });

    if (!!isreserve) {
      

      io.of('/admin').emit("nowReservedtabel", {
        tableid: tableid,
        userid: userid,
        username: username,
        time: time,
        date: date,
      });
    }
    return Response.json({ message: "table reserved" });
  } catch (e) {
    throw new Error("failed to reserve");
  }
}

const getDate = () => {
  const now = new Date();
  const startofDay = new Date(now.setHours(0, 0, 0, 0));
  const endofDay = new Date(now.setHours(23, 59, 59, 59));
  const startTomorrow = new Date(now);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  startTomorrow.setHours(0, 0, 0, 0);
  return { startofDay, endofDay, startTomorrow };
};

//automatice reset function
export async function resetfunction() {
  const { startofDay, endofDay, startTomorrow } = getDate();

  await prisma.$transaction(async (tx) => {
    //get tomorrow reservation
    const tomorrowReservation = await tx.reservation.findMany({
      where: {
        date: {
          gte: startTomorrow,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      orderBy: {
        time: "asc",
      },
    });

    //reset all tables to available
    tx.table.updateMany({
      data: {
        isAvailable: true,
      },
    });

    //reset again make false for tomorrow table
    for (const reservation of tomorrowReservation) {
      tx.table.update({
        where: {
          id: reservation.TableId,
        },
        data: {
          isAvailable: false,
        },
      });
    }
    //archeive all today reservation
    tx.reservation.updateMany({
      where: {
        date: {
          gte: startofDay,
          lte: endofDay,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      data: {
        status: "ARCHIVED",
      },
    });
  });
}

//get all table on a given date which are show availabilty
export async function getAlltable(inputDate: string) {
  try {
    const requestedDate = new Date(inputDate);
    const startofDay = new Date((requestedDate as Date).setHours(0, 0, 0, 0));
    const endofDay = new Date(
      (requestedDate as Date).setHours(23, 59, 59, 999)
    );
    const [tabel, reservation] = await prisma.$transaction([
      //this value will go to table
      prisma.table.findMany(),
      prisma.reservation.findMany({
        where: {
          date: {
            gte: startofDay,
            lte: endofDay,
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        orderBy: {
          time: "asc",
        },
      }),
    ]);

    const availabilty: Record<string, any> = {};
    const slots = genrateslots();
    slots.forEach((slot) => {
      availabilty[slot] = tabel.map((table) => ({
        tableid: table.id,
        tableNumber: table.tablenumber,
        capacity: table.capacity,
        isAvailable: !reservation.some(
          (r) => r.time === slot && r.TableId === table.id
        ),
      }));
    });

    io.of('/client').emit('filterdate',{
      alltable : availabilty
    })
    io.of('/admin').emit('filterdate',{
      alltable : availabilty
    })
    io.of('/client').emit('alltable',{
      alltable : availabilty
    })
    io.of('/admin').emit('alltable',{
      alltable : availabilty
    })

    // return availabilty;
    
  } catch (e) {
    throw new Error("message");
  }
}

//check availabel condition using checking condition
export async function checkavailability(
  getAlltable: any,
  slot: string,
  tableid: string
) {
  const getslots = getAlltable[`${slot}`];
  getslots.some((r: any) => r.tableid === tableid);
  return getslots;
}

//genrate slots
export function genrateslots() {
  const slots = [];
  const starthrs = 10;
  const endhrs = 22;
  for (let hrs = starthrs; hrs < endhrs; hrs++) {
    slots.push(`${hrs.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

// //automatic reset the tale for tomorrow
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running scheduled table reset...");
//   await resetfunction();
// });
