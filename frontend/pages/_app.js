import "@/styles/globals.css";
import Navbar from "../components/navbar";
import { UserProvider } from "@/context/userContext";

export default function App({ Component, pageProps }) {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}
