import {Server} from 'socket.io'
import { wsservice } from "@/app/actions/websocket/service";
import { getAlltable } from "@/app/actions/reservation/reservation";


export default function Handler(req:any,res:any){
  if(!res.socket.server.io){
    console.log('starting scoket.io server....');
    const io = new Server(res.socket.server);

    io.on('connection', async (socket)=>{

      
      wsservice.addclient(socket.id)
      socket.on('message',(msg)=>{
        console.log(msg)
        socket.broadcast.emit('message' , msg)
      })
    })
    res.socketl.server.io =  io;
  }else {
    console.log('Socket.io server already running')
  }
  res.end();
}


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
      const tabledata = await getAlltable(data.date);
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

