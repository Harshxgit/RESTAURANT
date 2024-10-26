import prisma from "@/db";

export async function insertTable(tableNumber:number,capacity:number,isAvailabel:boolean){
    const data = await prisma.table.create({
        data:{
            tablenumber:tableNumber,
            capacity:capacity,
            isAvailable:isAvailabel
        }
    })
    if(!data) throw new Error("failed to inser")
    return data
}