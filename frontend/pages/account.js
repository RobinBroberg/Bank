import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "./components/navbar";
import Logout from "./components/logout";

export default function Account() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState(null);
  const [balance, setBalance] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedOtp = localStorage.getItem("otp");

      if (!storedUserId || !storedOtp) {
        router.push("/login");
      } else {
        setUserId(storedUserId);
        setOtp(storedOtp);
        fetchBalance(storedUserId, storedOtp);
      }
    }
  }, []);

  async function fetchBalance(userId, otp) {
    console.log("Fetching balance with:", { userId, otp });

    const response = await fetch("http://localhost:3001/me/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token: otp }),
    });

    const data = await response.json();
    setBalance(data.amount);
  }

  async function handleDeposit(e) {
    e.preventDefault();

    await fetch("http://localhost:3001/me/accounts/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        token: otp,
        amount: Number(depositAmount),
      }),
    });

    setDepositAmount("");
    fetchBalance(userId, otp);
  }

  if (!userId || !otp) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Ditt Konto</h2>
        <p className="text-xl mt-4">
          Saldo: {balance !== null ? `${balance} kr` : "Laddar..."}
        </p>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold">Sätt in pengar</h3>
          <form onSubmit={handleDeposit} className="mt-4">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Sätt in
            </button>
          </form>
        </div>
        <div className="mt-6">
          <Logout />
        </div>
      </div>
    </div>
  );
}
