import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "./utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const data = await loginUser(username, password);

    if (!data) {
      return;
    }

    localStorage.setItem("userId", data.userId);
    localStorage.setItem("otp", data.otp);
    localStorage.setItem("username", username);

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center py-10">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Logga in
          </h2>
          <form onSubmit={handleLogin} className="mt-4">
            <label className="block text-gray-700">Användarnamn</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="block text-gray-700 mt-4">Lösenord</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Logga in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
