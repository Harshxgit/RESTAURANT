import { WebSocketServer } from "ws";
import { wsservice } from "@/app/actions/websocket/service";
import { string } from "zod";
import { getAlltable } from "@/app/actions/reservation/reservation";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", async (ws) => {
  console.log("new client connected");

  //add client to servic
  wsservice.addclient(ws);

  //handle the message
  ws.on("message", async (message: Buffer) => {
    const messageString = message.toString();
    const data = JSON.parse(messageString);

    if (data.type === "filterdate") {
      const tabledata = getAlltable(data.date);
      ws.send(
        JSON.stringify({
          type: "all table",
          data: tabledata,
        })
      );
    }
    await wsservice.tableBoradcasts(data.date);
  });

  ws.on("close", () => {
    console.log("client disconnected");
    wsservice.removeClient(ws);
  });
});
