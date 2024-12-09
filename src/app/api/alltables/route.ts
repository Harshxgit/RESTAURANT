// import { getAlltable } from "@/app/actions/reservation/reservation";
import { insertTable } from "@/app/actions/table/table";
import prisma from "@/db";

//i wrote the check table function , bcz its repeate more than one
const checkexistatble = async (tablenumber: number) => {
  const isexisttable = await prisma.table.findUnique({
    where: {
      tablenumber: tablenumber,
    },
  });
  if (isexisttable) return Response.json({ message: "table exist" });
};

export async function GET() {
  const allTabel = await prisma.table.findMany();
  return Response.json(allTabel);
}

export async function POST(req: Request) {
  const { tablenumber, capacity, isAvailabel } = await req.json();

  const checkexist = await checkexistatble(tablenumber);
  if (checkexist) return Response.json({ message: "table existed" });
  const puttable = await insertTable(tablenumber, capacity, isAvailabel);
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
  if (!deleteTabel) return Response.json({ message: "table not deleted" });
  return Response.json({ message: "table deleted" });
}

export async function PUT(req: Request) {
  const { tableid, tablenumber, capacity, isAvailabel } = await req.json();
  const updatetbale = await prisma.table.update({
    where: {
      id: tableid,
    },
    data: {
      capacity: capacity,
      isAvailable: isAvailabel,
      tablenumber: tablenumber,
    },
  });
  if (!updatetbale) return Response.json({ message: "table not updated" });
  return Response.json({ message: "table updated" });
}
