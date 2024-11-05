const {createServer} = require('http');
const { Server } = require("socket.io");
const next = require("next");
const { server } = require("typescript");

const dev = process.env.NODE_ENV !== "production";
const hostname = 'localhost';
const port = process.env.PORT || 3000;

//initialize Next.js Server
const app = next({ dev, hostname ,port });
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

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server running on http://localhost:3000");
  });
});
