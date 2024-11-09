import { Server } from "http";
import { io, Socket } from "socket.io-client";

let connections : Record<string , Socket>

export const initiateConnection: any = (namespace: string) => {
  //if this connection already exist using this namespace
  if (connections[namespace]) {
    return connections;
  }

  //connect socket and store in it object
  const socket = io(namespace)
  connections[namespace] = socket;

  socket.on('connect',()=>{
    console.log(`client connection ${namespace}`)
  })

  socket.on('disconnect',()=>{
    console.log(`client connection ${namespace}`)
  })

  return connections;
};
