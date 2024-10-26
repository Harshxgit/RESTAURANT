import { getAlltable } from "@/app/actions/reservation/reservation";
import prisma from "@/db";

//i wrote the check table function , bcz its repeate more than one  
const checkexistatble = async(tablenumber:number) => {
  const isexisttable = await prisma.table.findUnique({
    where: {
      tablenumber: tablenumber,
    },
  });
  if (isexisttable) return Response.json({ message: "table exist" });
};

//get all today reserve tabel . its for websocket
// export async function GET(req: Request) {
//   const { date } = await req.json();
//   const getalltable = await getAlltable(date);
//   return Response.json(getalltable);
// }
export async function GET() {
  
  const allTabel = await prisma.table.findMany();
  return Response.json(allTabel)

}
export async function POST(req: Request) {
  const { tablenumber, capacity, isAvailabel } = await req.json();

  const puttable = await prisma.table.create({
    data: {
      tablenumber: tablenumber,
      capacity: capacity,
      isAvailable: isAvailabel,
    },
  });
  if (!puttable) return Response.json({ message: "failed to insert data" });
  return Response.json({ message: "table inserted" });
}

export async function DELETE(req: Request) {
  const { tableid } = await req.json();
  const deleteTabel = await prisma.table.delete({
    where: {
      id: tableid,
    },
  });
}
