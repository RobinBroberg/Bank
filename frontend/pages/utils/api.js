const BASE_URL = "http://localhost:3001";

export async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    alert(data.error || "Login failed!");
    return;
  }

  return await response.json();
}

export async function registerUser(username, password) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
}

export async function getBalance(userId, otp) {
  const response = await fetch(`${BASE_URL}/me/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token: otp }),
  });

  const data = await response.json();
  return data.amount;
}

export async function depositToAccount(userId, otp, amount) {
  const response = await fetch(`${BASE_URL}/me/accounts/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token: otp, amount }),
  });

  const data = await response.json();
  return data;
}

export async function logoutUser(userId) {
  const response = await fetch("http://localhost:3001/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
