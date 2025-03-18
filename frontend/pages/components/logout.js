import { useRouter } from "next/router";

export default function Logout({ userId }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("http://localhost:3001/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: localStorage.getItem("userId") }),
    });

    localStorage.removeItem("userId");
    localStorage.removeItem("otp");
    localStorage.removeItem("username");

    console.log("User logged out.");
    router.push("/login");
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
