import { Container, Paper, Typography } from "@mui/material";
import React from "react";
import useBookSocket, { PREC_LEVEL } from "../../hooks/useBookSocket";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import AsksTable from "./AsksTable";
import BidsTable from "./BidsTable";
import Config from "./Config";
import { changePrecLevel, receivePriceLevel } from "./reduxSlice";
import "./styles.css";

function OrderBook() {
  const dispatch = useAppDispatch();
  const [precLevel, setPrecLevel] = React.useState<PREC_LEVEL>(0);
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

  const { isConnected, changePrec } = useBookSocket(onData, {
    precLevel,
    symbol: "tBTCUSD",
  });

  const handleChangePrecLevel = React.useCallback(
    (precLevel: PREC_LEVEL) => {
      dispatch(changePrecLevel(precLevel));
      changePrec(precLevel);
      setPrecLevel(precLevel);
    },
    [changePrec, dispatch]
  );

  return (
    <Container className="OrderBook">
      <Typography className="socket-status">
        Socket: {isConnected ? "Connected" : "Not connected"}
      </Typography>
      <Config onChangePrecLevel={handleChangePrecLevel} precLevel={precLevel} />
      <Paper className="tables">
        <BidsTable data={bidsTableData} />
        <AsksTable data={asksTableData} />
      </Paper>
    </Container>
  );
}

export default OrderBook;
