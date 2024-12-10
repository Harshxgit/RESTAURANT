" use server"
import {prisma} from "@/db/index";

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