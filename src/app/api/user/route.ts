import { setUser } from "@/app/actions/user/userDetails"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    const{firstname , lastname , number , password} = await req.json()
    
    const set = await setUser(firstname,lastname,number, password)

    if(!set) NextResponse.json({message:"failed"},{status:404})
    return NextResponse.json({message:"successfully"},{status:200})

}