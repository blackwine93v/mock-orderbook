import React from "react";
import { isBulkRawPriceData, isRawPriceData, parseData } from "../utils/socket";

export enum EVENT_TYPE {
  SUBCRIBE = "subscribe",
  UNSUBCRIBE = "unsubscribe",
  SUBCRIBED = "subscribed",
}

export enum CHANNEL {
  BOOK = "book",
}

export type PREC_LEVEL = 0 | 1 | 2 | 3 | 4;

const SYMBOL = "tBTCUSD";
const DEFAULT_PREC_LEVEL: PREC_LEVEL = 0;

function useBookSocket(onData: (data: number[]) => void) {
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    let chanId: number;

    // TODO: unsubscribe if change channel

    let msg = JSON.stringify({
      event: EVENT_TYPE.SUBCRIBE,
      channel: CHANNEL.BOOK,
      symbol: SYMBOL,
      prec: `P${DEFAULT_PREC_LEVEL}`,
    });

    // Connection opened
    socket.addEventListener("open", () => {
      socket.send(msg);
      setIsConnected(true);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const { status, data } = parseData(event.data);

      // skip this message for now
      if (!status) return;

      if (
        data?.event === EVENT_TYPE.SUBCRIBED &&
        data?.channel === CHANNEL.BOOK
      ) {
        chanId = data.chanId;
      }

      // get data from the current channel id
      if (data instanceof Array && data[0] === chanId) {
        const rawPriceData = data[1] as any[];
        if (isRawPriceData(rawPriceData)) {
          onData(rawPriceData);
          return;
        }

        if (isBulkRawPriceData(rawPriceData)) {
          rawPriceData.forEach(onData);
          return;
        }
      }
    });
  }, [onData]);

  return { isConnected: true };
}

export default useBookSocket;
