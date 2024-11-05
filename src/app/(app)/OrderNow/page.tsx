import React, { useEffect, useState } from "react";

export default function page() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const newsocket = new WebSocket("ws://localhost:3001");
    newsocket.onopen = () => {
      console.log("collection established");
      newsocket.send("hello world");
    };
    newsocket.onmessage =(message) =>{
      console.log("message",message.data)
    }
    setSocket(newsocket);
    return () => newsocket.close();
  }, []);

  return <div>hello harshu</div>;
}
