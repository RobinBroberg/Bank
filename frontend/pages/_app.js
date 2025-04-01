import "@/styles/globals.css";
import Navbar from "../components/navbar";
import { UserProvider } from "../context/UserContext";

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
