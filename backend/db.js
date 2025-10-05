import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  const db = await open({
    filename: "./helpdesk.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, email TEXT UNIQUE, password TEXT, role TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT, description TEXT, status TEXT DEFAULT 'open',
      assigned_to INTEGER, user_id INTEGER, updated_at TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER, user_id INTEGER, content TEXT, created_at TEXT
    );
  `);

  // Seed test data if not present
  const userCount = await db.get(`SELECT COUNT(*) as count FROM users`);
  if (userCount.count === 0) {
    await db.run(`INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@test.com', '123', 'admin')`);
    await db.run(`INSERT INTO users (name, email, password, role) VALUES ('Agent', 'agent@test.com', '123', 'agent')`);
    await db.run(`INSERT INTO users (name, email, password, role) VALUES ('User', 'user@test.com', '123', 'user')`);
  }
  const ticketCount = await db.get(`SELECT COUNT(*) as count FROM tickets`);
  if (ticketCount.count === 0) {
    await db.run(`INSERT INTO tickets (title, description, user_id, updated_at) VALUES ('Printer Issue', 'Printer not working in room 101', 1, datetime('now'))`);
    await db.run(`INSERT INTO tickets (title, description, user_id, updated_at) VALUES ('Network Down', 'No internet in office', 3, datetime('now'))`);
  }
  const commentCount = await db.get(`SELECT COUNT(*) as count FROM comments`);
  if (commentCount.count === 0) {
    await db.run(`INSERT INTO comments (ticket_id, user_id, content, created_at) VALUES (1, 2, 'We are checking the printer.', datetime('now'))`);
    await db.run(`INSERT INTO comments (ticket_id, user_id, content, created_at) VALUES (2, 1, 'Network issue escalated.', datetime('now'))`);
  }
  return db;
};
