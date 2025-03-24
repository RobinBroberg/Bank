import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = localStorage.getItem("userId");
      const otp = localStorage.getItem("otp");
      const storedUserName = localStorage.getItem("username");

      setLoggedIn(userId !== null && otp !== null);
      if (storedUserName) setUserName(storedUserName);
    };
    checkLoginStatus();
    router.events.on("routeChangeComplete", checkLoginStatus);
    return () => {
      router.events.off("routeChangeComplete", checkLoginStatus);
    };
  }, [router.events]);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h2 className="text-4xl font-bold text-gray-900">
          {loggedIn
            ? `Välkommen tillbaka, ${userName}!`
            : "Välkommen till Banken"}
        </h2>
        <p className="mt-4 text-gray-600">
          {loggedIn ? "Hantera ditt konto och gör transaktioner enkelt." : ""}
        </p>

        {loggedIn ? (
          <Link
            href="/account"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Gå till ditt konto
          </Link>
        ) : (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
            <h3 className="text-2xl font-semibold text-gray-900">
              Kom igång direkt
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Skapa ett konto eller logga in för att börja använda tjänsten.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                href="/register"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Skapa användare
              </Link>

              <span className="text-sm text-gray-500">eller</span>

              <Link
                href="/login"
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Logga in
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
