import { useRouter } from "next/router";
import { logoutUser } from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Logout() {
  const router = useRouter();
  const { user, logout } = useUser();

  async function handleLogout() {
    if (user?.userId) {
      await logoutUser(user.userId);
    }

    logout();
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
