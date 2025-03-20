import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

const users = [];
const accounts = [];
let sessions = [];

let userIds = 1;
let accountIds = 1;

app.post("/users", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const userId = userIds++;
  const user = { id: userId, username, password };
  users.push(user);

  const accountId = accountIds++;
  const account = { id: accountId, userId, amount: 0 };
  accounts.push(account);

  res.status(201).json({ message: "User created successfully", userId });
});

app.post("/sessions", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Login failed" });
  }

  const otp = generateOTP();
  sessions = sessions.filter((session) => session.userId !== user.id);
  sessions.push({ userId: user.id, token: otp });

  res.json({ message: "Login successful", otp, userId: user.id });
});

app.post("/me/accounts", (req, res) => {
  const { userId, token } = req.body;

  const session = sessions.find(
    (session) => session.userId == userId && session.token === token
  );
  if (!session) {
    console.log("Unauthorized access - Invalid OTP");
    return res.status(401).json({ error: "Invalid OTP" });
  }

  const account = accounts.find((acc) => acc.userId == userId);
  res.json({ amount: account.amount });
});

app.post("/me/accounts/transactions", (req, res) => {
  const { userId, token, amount } = req.body;

  const session = sessions.find(
    (session) => session.userId == userId && session.token === token
  );
  if (!session) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  const account = accounts.find((acc) => acc.userId == userId);
  account.amount += amount;

  res.json({ message: `Deposited ${amount} kr`, newBalance: account.amount });
});

app.post("/logout", (req, res) => {
  const { userId } = req.body;
  sessions = sessions.filter((session) => session.userId != userId);
  res.json({ message: "Logout successful" });
});

app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});
