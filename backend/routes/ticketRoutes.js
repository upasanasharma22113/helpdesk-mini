import express from "express";
import { initDB } from "../db.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // auth middleware
import { error } from "../utils/error.js";

const router = express.Router();

// Create ticket with SLA
router.post("/tickets", verifyToken, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !description)
      return res.status(400).json(error("FIELD_REQUIRED", "title/description", "Title & description required"));

    const db = await initDB();

    // SLA deadline
    const now = new Date();
    let dueDate;
    if (priority === "high") {
      dueDate = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
    } else {
      dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    }

    const result = await db.run(
      "INSERT INTO tickets (title, description, status, priority, user_id, due_date) VALUES (?, ?, 'open', ?, ?, ?)",
      [title, description, priority || "normal", req.user.id, dueDate.toISOString()]
    );

    // Timeline log
    await db.run("INSERT INTO timeline (ticket_id, action, user_id) VALUES (?, ?, ?)", [
      result.lastID,
      "Ticket created",
      req.user.id,
    ]);

    res.json({ id: result.lastID, message: "Ticket created successfully" });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// List tickets with SLA breached info
router.get("/tickets", verifyToken, async (req, res) => {
  try {
    const { limit = 5, offset = 0 } = req.query;
    const db = await initDB();
    const tickets = await db.all("SELECT * FROM tickets LIMIT ? OFFSET ?", [limit, offset]);

    const now = new Date();
    tickets.forEach((t) => {
      t.breached = t.due_date && new Date(t.due_date) < now;
    });

    res.json({ items: tickets, next_offset: parseInt(offset) + parseInt(limit) });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// Get single ticket by ID
router.get("/tickets/:id", verifyToken, async (req, res) => {
  try {
    const db = await initDB();
    const ticket = await db.get("SELECT * FROM tickets WHERE id = ?", [req.params.id]);
    if (!ticket) return res.status(404).json(error("NOT_FOUND", "id", "Ticket not found"));
    res.json(ticket);
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// Update ticket (stale PATCH → 409)
router.patch("/tickets/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, status, priority, updated_at } = req.body;
    const db = await initDB();
    const ticket = await db.get("SELECT * FROM tickets WHERE id = ?", [req.params.id]);
    if (!ticket) return res.status(404).json(error("NOT_FOUND", "id", "Ticket not found"));

    // Conflict check
    if (updated_at && new Date(updated_at).getTime() !== new Date(ticket.updated_at).getTime()) {
      return res.status(409).json(error("CONFLICT", null, "Ticket has been updated by someone else"));
    }

    const now = new Date().toISOString();
    await db.run(
      "UPDATE tickets SET title = ?, description = ?, status = ?, priority = ?, updated_at = ? WHERE id = ?",
      [title || ticket.title, description || ticket.description, status || ticket.status, priority || ticket.priority, now, req.params.id]
    );

    // Timeline log
    await db.run("INSERT INTO timeline (ticket_id, action, user_id) VALUES (?, ?, ?)", [
      req.params.id,
      "Ticket updated",
      req.user.id,
    ]);

    res.json({ message: "Ticket updated successfully" });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

// Ticket timeline
router.get("/tickets/:id/timeline", verifyToken, async (req, res) => {
  try {
    const db = await initDB();
    const logs = await db.all("SELECT * FROM timeline WHERE ticket_id = ? ORDER BY created_at ASC", [req.params.id]);
    res.json({ logs });
  } catch (e) {
    res.status(500).json(error("SERVER_ERROR", null, e.message));
  }
});

export default router;
