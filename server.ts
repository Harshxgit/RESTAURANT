import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port:number|undefined = process.env.PORT ? Number(process.env.Port) || 3000:undefined ;

//initialize Next.js Server
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });

  server.listen(port, () => {
        console.log(`Server running on ${port}`);
  });
});
