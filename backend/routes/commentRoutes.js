import express from "express";
import { initDB } from "../db.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // auth middleware
import { error } from "../utils/error.js";

const router = express.Router();

// Add comment to ticket (authenticated)
router.post("/tickets/:id/comments", verifyToken, async (req, res) => {
  try {
    const db = await initDB();
    const { content } = req.body;

    if (!content)
      return res.status(400).json(error("FIELD_REQUIRED", "content", "Content is required"));

    // Check if ticket exists
    const ticket = await db.get(`SELECT * FROM tickets WHERE id = ?`, [req.params.id]);
    if (!ticket)
      return res.status(404).json(error("NOT_FOUND", "id", "Ticket not found"));

    const now = new Date().toISOString();

    // Insert comment using logged-in user's ID
    const result = await db.run(
      `INSERT INTO comments (ticket_id, user_id, content, created_at) VALUES (?, ?, ?, ?)`,
      [req.params.id, req.user.id, content, now]
    );

    // Log in timeline
    await db.run(
      `INSERT INTO timeline (ticket_id, action, user_id, created_at) VALUES (?, ?, ?, ?)`,
      [req.params.id, `Comment added`, req.user.id, now]
    );

    res.json({ id: result.lastID, message: "Comment added" });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

export default router;
