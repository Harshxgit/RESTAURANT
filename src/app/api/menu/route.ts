import { addMenu, getMenu } from "@/app/actions/addMenu";
import { NextApiRequest, NextApiResponse } from "next";


export async function GET(request:Request) {
  
    try {
      const data = await getMenu();
      if (!data) return Response.json({ error: "menu data not found" });
      return Response.json(data);
    } catch (error) {
    Response.json({ error: "failed to fetch data" });
    }
}
  
 export async function POST(req:Request){
    const { name, price, description, category } = await req.json();
    if (!name || !price || !description || !category)
      return Response.json({ error: "data not found" });
    try {
      const insertdata = await addMenu(name, price, description, category);
      if (!insertdata) return Response.json({ error: "data not found" });
      return Response.json({ message: "data inserted" });
    } catch (e) {
      return Response.json({ error: "failed" });
    }
  }
