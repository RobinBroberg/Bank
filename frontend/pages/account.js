import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { depositToAccount, getBalance } from "../utils/api";
import { useUser } from "@/context/userContext";

export default function Account() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [balance, setBalance] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }

    if (user) {
      fetchBalance(user.userId, user.otp);
    }
  }, [user, loading]);

  async function fetchBalance(userId, otp) {
    const amount = await getBalance(userId, otp);
    setBalance(amount);
  }

  async function handleDeposit(e) {
    e.preventDefault();
    await depositToAccount(user.userId, user.otp, Number(depositAmount));
    setDepositAmount("");
    fetchBalance(user.userId, user.otp);
  }

  if (loading) return <p>Laddar...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Ditt Konto</h2>
        <p className="text-xl mt-4 text-gray-800">
          Saldo: {balance !== null ? `${balance} kr` : "Laddar..."}
        </p>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-bold text-gray-800">Sätt in pengar</h3>
          <form onSubmit={handleDeposit} className="mt-4">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-800"
              required
            />
            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Sätt in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
