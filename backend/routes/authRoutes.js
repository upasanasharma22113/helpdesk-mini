import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initDB } from "../db.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: { code: "FIELD_REQUIRED", field: "email/name/password", message: "All fields are required" } });

    const db = await initDB();
    const existing = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existing) return res.status(400).json({ error: { code: "EMAIL_EXISTS", field: "email", message: "Email already registered" } });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: { code: "FIELD_REQUIRED", field: "email/password", message: "Email and password required" } });

    const db = await initDB();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(400).json({ error: { code: "USER_NOT_FOUND", field: "email", message: "User not found" } });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: { code: "INVALID_PASSWORD", field: "password", message: "Password incorrect" } });

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
});

export default router;
