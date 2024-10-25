import { addMenu, getMenu } from "@/app/actions/menu/addMenu";
import { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await getMenu();
      if (!data) return res.status(404).json({ error: "menu data not found" });
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "failed to fetch data" });
    }
  }
  
  if (req.method === "POST") {
    const { name, price, description, category } = req.body;
    if (!name || price || description || category)
      return res.status(500).json({ error: "data not found" });
    try {
      const insertdata = await addMenu(name, price, description, category);
      if (!insertdata) return res.status(500).json({ error: "data not found" });
      return res.status(200).json({ message: "data inserted" });
    } catch (e) {
      return res.status(500).json({ error: "failed" });
    }
  }
}
