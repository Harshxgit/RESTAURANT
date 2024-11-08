import { initsocket } from "@/app/actions/websocket/service";

const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

//initialize Next.js Server
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  //@ts-ignore
  const server = createServer((req, res) => {
    handle(req, res);
  });

  initsocket(server);

  server.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
});
