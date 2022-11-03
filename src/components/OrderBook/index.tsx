import { Container, Paper, Typography } from "@mui/material";
import React from "react";
import useBookSocket from "../../hooks/useBookSocket";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import AsksTable from "./AsksTable";
import BidsTable from "./BidsTable";
import { receivePriceLevel } from "./reduxSlice";
import "./styles.css";

function OrderBook() {
  const dispatch = useAppDispatch();
  const orderBook = useAppSelector((state) => state.orderBook.book);
  const bidsTableData = Object.values(orderBook.bids).reverse();
  const asksTableData = Object.values(orderBook.asks);
  const onData = React.useCallback(
    (data: number[]) => {
      dispatch(
        receivePriceLevel({
          price: data[0],
          count: data[1],
          amount: data[2],
        })
      );
    },
    [dispatch]
  );

  const { isConnected } = useBookSocket(onData);

  return (
    <Container className="OrderBook">
      <Typography className="socket-status">Socket: {isConnected ? "Connected" : "Not connected"}</Typography>
      <Paper className="tables">
        <BidsTable data={bidsTableData} />
        <AsksTable data={asksTableData} />
      </Paper>
    </Container>
  );
}

export default OrderBook;
