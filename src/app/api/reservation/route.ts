import prisma from "@/db";

export async function getAlltable(inputDate: string | Date) {
  try {
    const requestedDate =
      typeof inputDate === "string" ? new Date(inputDate) : Date;
    //check if requestedDate is a Date instance , then use setHours

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
  

    const availabilty:Record<string,any> = {};
    const slots = genrateslots()
    slots.forEach(slot=>{
        availabilty[slot] = tabel.map(table=>({
            tableid: table.id,
            tableNumber:table.tablenumber,
            capacity : table.capacity,
            isAvailable : !reservation.some(r=>
                r.time === slot && r.TableId === table.id
            )
        }))
    })
    return availabilty;

  } catch (e) {}
}

export function genrateslots() {
  const slots = [];
  const starthrs = 10;
  const endhrs = 22;
  for (let hrs = starthrs; hrs < starthrs; hrs++) {
    slots.push(`${hrs.toString().padStart(2,'0')}:00`);
  }
  return slots;
}
