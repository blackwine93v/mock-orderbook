import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import OrderBook from "./components/OrderBook";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <OrderBook />
    </Provider>
  );
}

export default App;
