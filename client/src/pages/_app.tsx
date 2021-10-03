import axios from "axios";
import { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { store } from "../app/store/store";
import "../styles/tailwind.css";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api/";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={4000} />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
