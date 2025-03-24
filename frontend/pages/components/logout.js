import { useRouter } from "next/router";
import { logoutUser } from "../utils/api";

export default function Logout({ userId }) {
  const router = useRouter();

  async function handleLogout() {
    const userId = localStorage.getItem("userId");

    await logoutUser(userId);

    localStorage.removeItem("userId");
    localStorage.removeItem("otp");
    localStorage.removeItem("username");

    console.log("User logged out.");
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Logga ut
    </button>
  );
}
