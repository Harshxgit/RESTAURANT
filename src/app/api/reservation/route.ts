import prisma from "@/db";
import cron from "node-cron";
//resete function for reset all table for tomorrow leaving this reserver table

interface orderItem {}
interface order {
  userid: string;
}
interface reservationtype {
  userid: string;
  username: string;
  tableid: string;
  partysize: string;
}

// export async function reserveNow(
//   userid: string,
//   Date: string,
//   time: string,
//   partysize: string,
//   tableid: string
// ) {
//   try {
//     const isreserve = prisma.$transaction((tx) => {
//       tx.reservation.create({});
//     });
//   } catch (e) {
//     throw new Error("failed to reserve");
//   }
// }

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
    //get all table
    const table = await tx.table.findMany();

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

//get all table on a given date which are available or which are not
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
    return availabilty;
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
  for (let hrs = starthrs; hrs < starthrs; hrs++) {
    slots.push(`${hrs.toString().padStart(2, "0")}:00`);
  }
  return slots;
}

//automatic reset the tale for tomorrow
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled table reset...");
  await resetfunction();
});
