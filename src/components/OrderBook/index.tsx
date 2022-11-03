import React from "react";
import useBookSocket from "../../hooks/useBookSocket";
import { useAppDispatch } from "../../redux/hook";
import { receivePriceLevel } from "./reduxSlice";

function OrderBook() {
  const dispatch = useAppDispatch();
  useBookSocket((data: number[]) => {
    console.log(data);
    dispatch(
      receivePriceLevel({
        price: data[0],
        count: data[1],
        amount: data[2],
      })
    );
  });

  return <div>OrderBook</div>;
}

export default OrderBook;
