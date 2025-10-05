
import express from "express";
import { initDB } from "../db.js";
import { checkIdempotency } from "../middlewares/idempotencyMiddleware.js";
const router = express.Router();

// Helper: error response
function error(code, field, message) {
  return { error: { code, field, message } };
}

// Create ticket (idempotent)
router.post("/", checkIdempotency, async (req, res) => {
  try {
    const db = await initDB();
    const { title, description, user_id } = req.body;
    if (!title) return res.status(400).json(error("FIELD_REQUIRED", "title", "Title is required"));
    if (!description) return res.status(400).json(error("FIELD_REQUIRED", "description", "Description is required"));
    if (!user_id) return res.status(400).json(error("FIELD_REQUIRED", "user_id", "User ID is required"));
    const now = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO tickets (title, description, user_id, updated_at) VALUES (?, ?, ?, ?)`,
      [title, description, user_id, now]
    );
    res.json({ id: result.lastID, message: "Ticket created successfully" });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// Get all tickets (pagination, search)
router.get("/", async (req, res) => {
  try {
    const db = await initDB();
    const { limit = 5, offset = 0, search = "" } = req.query;
    let query = `SELECT t.*, (SELECT content FROM comments WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as latest_comment FROM tickets t`;
    let params = [];
    if (search) {
      query += ` WHERE t.title LIKE ? OR t.description LIKE ? OR latest_comment LIKE ?`;
      params = ["%" + search + "%", "%" + search + "%", "%" + search + "%"];
    }
    query += ` ORDER BY t.updated_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const tickets = await db.all(query, params);
    const next_offset = tickets.length === Number(limit) ? Number(offset) + Number(limit) : null;
    res.json({ items: tickets, next_offset });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// Get ticket by id
router.get("/:id", async (req, res) => {
  try {
    const db = await initDB();
    const ticket = await db.get(`SELECT * FROM tickets WHERE id = ?`, [req.params.id]);
    if (!ticket) return res.status(404).json(error("NOT_FOUND", "id", "Ticket not found"));
    res.json(ticket);
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// PATCH ticket (optimistic locking)
router.patch("/:id", async (req, res) => {
  try {
    const db = await initDB();
    const { title, description, status, updated_at } = req.body;
    const ticket = await db.get(`SELECT * FROM tickets WHERE id = ?`, [req.params.id]);
    if (!ticket) return res.status(404).json(error("NOT_FOUND", "id", "Ticket not found"));
    if (updated_at && updated_at !== ticket.updated_at) {
      return res.status(409).json(error("STALE_PATCH", "updated_at", "Ticket was updated by someone else"));
    }
    const now = new Date().toISOString();
    await db.run(
      `UPDATE tickets SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), updated_at = ? WHERE id = ?`,
      [title, description, status, now, req.params.id]
    );
    res.json({ message: "Ticket updated", updated_at: now });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

export default router;
