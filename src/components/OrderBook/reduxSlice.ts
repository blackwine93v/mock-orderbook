import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import { PREC_LEVEL } from "../../hooks/useBookSocket";

export type PriceLevel = {
  price: number;
  count: number;
  amount: number;
};

const initialState: {
  precLevel: PREC_LEVEL;
  symbol: string;
  book: {
    bids: { [price: number]: PriceLevel };
    asks: { [price: number]: PriceLevel };
  };
} = {
  precLevel: 0,
  symbol: "",
  book: {
    bids: {},
    asks: {},
  },
};

export const orderBookSlice = createSlice({
  name: "orderbook",
  initialState,
  reducers: {
    receivePriceLevel: (state, action: PayloadAction<PriceLevel>) => {
      const { count, amount, price } = action.payload;
      // add or update this price level
      if (count > 0) {
        if (amount > 0) {
          // bids
          state.book.bids[price] = { price, count, amount };
        } else {
          // asks
          state.book.asks[price] = { price, count, amount };
        }
      } else {
        // delete this price level
        if (amount === 1) {
          // bids
          delete state.book.bids[price];
        } else if (amount === -1) {
          // asks
          delete state.book.asks[price];
        }
      }
    },
    changePrecLevel: (state, action: PayloadAction<PREC_LEVEL>) => {
      state.precLevel = action.payload;
      state.book.asks = {};
      state.book.bids = {};
    }
  },
});

export const { receivePriceLevel, changePrecLevel } = orderBookSlice.actions;

export default orderBookSlice.reducer;
