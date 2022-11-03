import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  book: any;
} = {
  book: {},
};

export const orderBookSlice = createSlice({
  name: "orderbook",
  initialState,
  reducers: {},
});

export default orderBookSlice.reducer;
