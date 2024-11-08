import {Server} from "socket.io"



export const initsocket =(server:any)=>{
    const io = new Server(server)

    const adminNamespace = io.of("/admin");
    const userNamespace = io.of('/user')

    //all admint logics are here
    adminNamespace.on('connection',(socket)=>{


    })


    //all user logic are here
    userNamespace.on('connection',(socket)=>{
        socket.on("filtertable",(arg)=>{

        })
    })
    return io
} 


  // private static instance: WebSocketService;
  // private client: Set<WebSocket>; //using set object ,  because we need only unique feature

  // private constructor() {
  //   this.client = new Set();
  // }

  // //singleton
  // public static getInstance(): WebSocketService {
  //   if (!WebSocketService.instance) {
  //     WebSocketService.instance = new WebSocketService();
  //   }
  //   return WebSocketService.instance;
  // }
  // public addclient(client: WebSocket) {
  //   this.client.add(client);
  // }
  // public removeClient(client: WebSocket) {
  //   this.client.delete(client);
  // }

  // public async tableBoradcasts(inputDate: string) {
  //   try {
  //     const tabledata = await getAlltable(inputDate);
  //     this.client.forEach((client) => {
  //       client.send(
  //         JSON.stringify({
  //           data: tabledata,
  //           type: "all tabledata",
  //         })
  //       );
  //     });
  //   } catch (e) {
  //     throw new Error("can't broadcast");
  //   }
  // }


