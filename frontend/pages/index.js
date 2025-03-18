import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/navbar";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      const otp = localStorage.getItem("otp");
      const storedUserName = localStorage.getItem("username");

      setLoggedIn(userId !== null && otp !== null);
      if (storedUserName) setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-4xl font-bold text-gray-900">
          {loggedIn
            ? `Välkommen tillbaka, ${userName}!`
            : "Välkommen till Banken"}
        </h2>
        <p className="mt-4 text-gray-600">
          {loggedIn
            ? "Hantera ditt konto och gör transaktioner enkelt."
            : "Hantera ditt konto enkelt och säkert."}
        </p>

        {loggedIn ? (
          <Link href="/account">
            <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
              Gå till ditt konto
            </button>
          </Link>
        ) : (
          <Link href="/register">
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
              Skapa användare
            </button>
          </Link>
        )}
      </main>
    </div>
  );
}
