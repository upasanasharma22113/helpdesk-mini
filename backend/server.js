import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import rateLimitMiddleware from "./middlewares/rateLimit.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware);

// Routes
app.use("/api", authRoutes);
app.use("/api", ticketRoutes);
app.use("/api", commentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/health", (req, res) => {
  res.json({ "message": "User registered" });
});


// Start Server
app.listen(PORT, async () => {
  await initDB();
  console.log(`✅ Backend running on port ${PORT}`);
});
