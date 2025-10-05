import express from "express";
const router = express.Router();

// Temporary user register/login (for testing)
router.post("/register", (req, res) => {
  res.json({ message: "Register endpoint working" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login endpoint working" });
});

export default router;
