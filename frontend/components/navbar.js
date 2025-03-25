import Link from "next/link";
import { useUser } from "@/context/userContext";

export default function Navbar() {
  const { user, logout } = useUser();

  return (
    <header className="bg-white shadow-md py-4">
      <div className="flex w-full items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-blue-600">Bank-sajt</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                  Hem
                </span>
              </Link>
            </li>

            {user && (
              <li>
                <Link href="/account">
                  <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                    Konto
                  </span>
                </Link>
              </li>
            )}

            {!user ? (
              <>
                <li>
                  <Link href="/login">
                    <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                      Logga in
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/register">
                    <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                      Skapa användare
                    </span>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Logga ut
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
