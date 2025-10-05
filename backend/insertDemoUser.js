import bcrypt from "bcryptjs";
import { initDB } from "./db.js";

async function insertAdmin() {
  const db = await initDB();
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const existing = await db.get("SELECT * FROM users WHERE email = ?", ["admin@mail.com"]);
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await db.run(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin", "admin@mail.com", hashedPassword, "admin"]
  );

  console.log("✅ Admin user inserted successfully");
  process.exit(0);
}

insertAdmin();
