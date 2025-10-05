import { initDB } from "./db.js";

async function addDueDateColumn() {
  const db = await initDB();
  try {
    await db.run("ALTER TABLE tickets ADD COLUMN due_date DATETIME");
    console.log("✅ Column 'due_date' added successfully");
  } catch (err) {
    if (err.message.includes("duplicate column")) {
      console.log("⚠ Column 'due_date' already exists");
    } else {
      console.error("❌ Error adding column:", err);
    }
  } finally {
    await db.close();
  }
}

addDueDateColumn();
