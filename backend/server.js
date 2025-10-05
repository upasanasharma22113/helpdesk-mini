import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rate limit middleware
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: { code: "RATE_LIMIT", message: "Too many requests" } }
}));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.get("/api/_meta", (_, res) => res.json({ service: "HelpDesk Mini", version: "1.0" }));

app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
