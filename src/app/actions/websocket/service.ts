import WebSocket from "ws";
import prisma from "@/db";
import { set } from "zod";

class WebSocketService {
  private static instance: WebSocketService;
  private client: Set<WebSocket>;

  private constructor() {
    this.client = new Set();
  }

  //singleton
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
  public addclient(client: WebSocket) {
    this.client.add(client);
  }
  public removeClient(client: WebSocket) {
    this.client.delete(client);
  }

  public async tableBoradcasts(inputDate: string) {
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
      const slots = [];
      const starthrs = 10;
      const endhrs = 22;
      for (let hrs = starthrs; hrs < endhrs; hrs++) {
        slots.push(`${hrs.toString().padStart(2, "0")}:00`);
      }

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
}
export const wsservice = WebSocketService.getInstance();
