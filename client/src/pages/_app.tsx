import axios from "axios";
import { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/tailwind.css";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
