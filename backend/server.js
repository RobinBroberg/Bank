import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  user: "root",
  password: "root",
  host: "mysql",
  database: "bank",
  port: 3306,
});

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

let sessions = [];

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    const userParams = [username, password];
    const result = await query(userSql, userParams);

    const userId = result.insertId;

    const accountSql = "INSERT INTO accounts (userId, amount) VALUES (?, ?)";
    const accountParams = [userId, 0];
    await query(accountSql, accountParams);

    res.status(201).json({ message: "User and account created", userId });
  } catch (error) {
    console.error("Error creating user/account:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    const params = [username, password];
    const result = await query(sql, params);
    const user = result[0];

    if (!user) {
      return res.status(401).json({ error: "Login failed" });
    }

    const otp = generateOTP();
    sessions = sessions.filter((session) => session.userId !== user.id);
    sessions.push({ userId: user.id, token: otp });

    res.json({ message: "Login successful", otp, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/me/accounts", async (req, res) => {
  const { userId, token } = req.body;

  const session = sessions.find(
    (session) => session.userId == userId && session.token === token
  );
  if (!session) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  try {
    const sql = "SELECT amount FROM accounts WHERE userId = ?";
    const result = await query(sql, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ amount: result[0].amount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/me/accounts/transactions", async (req, res) => {
  const { userId, token, amount } = req.body;

  const session = sessions.find(
    (session) => session.userId == userId && session.token === token
  );
  if (!session) {
    return res.status(401).json({ error: "Invalid OTP" });
  }
  try {
    const updateSql =
      "UPDATE accounts SET amount = amount + ? WHERE userId = ?";
    const updateParams = [amount, userId];
    await query(updateSql, updateParams);

    const selectSql = "SELECT amount FROM accounts WHERE userId = ?";
    const result = await query(selectSql, [userId]);

    res.json({
      message: `Deposited ${amount} kr`,
      newBalance: result[0].amount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  const { userId } = req.body;
  sessions = sessions.filter((session) => session.userId != userId);
  res.json({ message: "Logout successful" });
});

app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});
