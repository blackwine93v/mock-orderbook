import React from "react";
import useBookSocket from "../../hooks/useBookSocket";

function OrderBook() {
  useBookSocket(console.log);

  return <div>OrderBook</div>;
}

export default OrderBook;
