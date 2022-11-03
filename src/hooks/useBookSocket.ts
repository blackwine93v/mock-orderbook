import React from "react";

function useBookSocket(onData: (data: any) => void) {
  React.useEffect(() => {
    const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    let msg = JSON.stringify({
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
      prec: "P1",
    });
    
    // Connection opened
    socket.addEventListener("open", (event) => {
      console.log("register event");
      socket.send(msg);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      onData(event.data);
    });
  }, [onData]);
}

export default useBookSocket;
