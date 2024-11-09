const { Server } = require("socket.io");
let io;
const initSocket = (server) => {
  if (!io) {
    io = new Server(server);

    const adminNamespace = io.of("/admin");
    const userNamespace = io.of("/user");

    //all admint logics are here
    adminNamespace.on("connection", (socket) => {});

    //all user logic are here
    userNamespace.on("connection", (socket) => {
      socket.on("filtertable", (arg) => {});
    });
  }
  return io;
};

module.exports = {
  initSocket,
  getIO: () => io,
};
