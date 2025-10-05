
import express from "express";
import { initDB } from "../db.js";
const router = express.Router();

function error(code, field, message) {
  return { error: { code, field, message } };
}

// Add comment to ticket
router.post("/:id/comments", async (req, res)  => {
  try {
    const db = await initDB();
    const { user_id, content } = req.body;
    if (!user_id) return res.status(400).json(error("FIELD_REQUIRED", "user_id", "User ID is required"));
    if (!content) return res.status(400).json(error("FIELD_REQUIRED", "content", "Content is required"));
    const ticket = await db.get(`SELECT * FROM tickets WHERE id = ?`, [req.params.id]);
    if (!ticket) return res.status(404).json(error("NOT_FOUND", "id", "Ticket not found"));
    const now = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO comments (ticket_id, user_id, content, created_at) VALUES (?, ?, ?, ?)`,
      [req.params.id, user_id, content, now]
    );
    res.json({ id: result.lastID, message: "Comment added" });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

export default router;
