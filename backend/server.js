import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const users = [];
const accounts = [];
let sessions = [];

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const id = users.length + 1;
  users.push({ id, username, password });

  accounts.push({ id: id, userId: id, amount: 0 });

  res.status(201).json({ message: "User created successfully", userId: id });
});

app.post("/sessions", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const otp = generateOTP();
  sessions = sessions.filter((s) => s.userId !== user.id);
  sessions.push({ userId: user.id, token: otp });

  console.log(`User ${user.id} logged in. OTP: ${otp}`);
  res.json({ message: "Login successful", otp, userId: user.id });
});

app.post("/me/accounts", (req, res) => {
  const { userId, token } = req.body;
  console.log("Checking balance for:", { userId, token });

  const session = sessions.find((s) => s.userId == userId && s.token === token);
  if (!session) {
    console.log("Unauthorized access - Invalid OTP");
    return res.status(401).json({ error: "Invalid OTP" });
  }

  const account = accounts.find((acc) => acc.userId == userId);
  if (!account) {
    console.log("Account not found for user:", userId);
    return res.status(404).json({ error: "Account not found" });
  }
  res.json({ amount: account.amount });
});

app.post("/me/accounts/transactions", (req, res) => {
  const { userId, token, amount } = req.body;

  const session = sessions.find((s) => s.userId == userId && s.token === token);
  if (!session) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  const account = accounts.find((acc) => acc.userId == userId);
  if (!account) {
    console.log("Account not found for user:", userId);
    return res.status(404).json({ error: "Account not found" });
  }

  account.amount += amount;
  console.log(
    `User ${userId} deposited ${amount}. New balance: ${account.amount}`
  );

  res.json({ message: `Deposited ${amount} kr`, newBalance: account.amount });
});

app.post("/logout", (req, res) => {
  const { userId } = req.body;
  console.log(`Logging out user ${userId}`);

  sessions = sessions.filter((s) => s.userId != userId);

  console.log("Updated sessions:", sessions);
  res.json({ message: "Logout successful" });
});

app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});
