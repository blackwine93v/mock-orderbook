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

export type BookSocketConfig = {
  precLevel?: PREC_LEVEL;
  symbol?: string;
};

const DEFAULT_SYMBOL = "tBTCUSD";
const DEFAULT_PREC_LEVEL: PREC_LEVEL = 0;

function useBookSocket(
  onData: (data: number[]) => void,
  config: BookSocketConfig = {
    precLevel: DEFAULT_PREC_LEVEL,
    symbol: DEFAULT_SYMBOL,
  }
) {
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<WebSocket>();
  let chanId = React.useRef<number>();

  React.useEffect(() => {
    const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    let msg = JSON.stringify({
      event: EVENT_TYPE.SUBCRIBE,
      channel: CHANNEL.BOOK,
      symbol: config.symbol,
      prec: `P${config.precLevel}`,
    });

    // Connection opened
    socket.addEventListener("open", () => {
      socket.send(msg);
      setIsConnected(true);
      setSocket(socket);
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
        chanId.current = data.chanId;
      }

      // get data from the current channel id
      if (data instanceof Array && data[0] === chanId.current) {
        const rawPriceData = data[1];

        if (rawPriceData instanceof Array) {
          if (isRawPriceData(rawPriceData)) {
            onData(rawPriceData);
            return;
          }

          if (isBulkRawPriceData(rawPriceData)) {
            rawPriceData.forEach(onData);
            return;
          }
        }
      }
    });
  }, [onData, config.precLevel, config.symbol]);

  const changePrec = React.useCallback(
    (level: PREC_LEVEL) => {
      if (socket) {
        // unsubcribe old chanId
        if (chanId.current) {
          socket.send(
            JSON.stringify({
              event: EVENT_TYPE.UNSUBCRIBE,
              chanId: chanId.current,
            })
          );
        }

        // set new prec level
        socket.send(
          JSON.stringify({
            event: EVENT_TYPE.SUBCRIBE,
            channel: CHANNEL.BOOK,
            symbol: config.symbol,
            prec: `P${level}`,
          })
        );
      }
    },
    [socket, config.symbol, chanId]
  );

  return { isConnected, socket, changePrec };
}

export default useBookSocket;
