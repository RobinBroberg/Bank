import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const otp = localStorage.getItem("otp");
    const username = localStorage.getItem("username");

    if (userId && otp && username) {
      setUser({ userId, otp, username });
    }

    setLoading(false);
  }, []);

  function login(data) {
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("otp", data.otp);
    localStorage.setItem("username", data.username);
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("otp");
    localStorage.removeItem("username");
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
