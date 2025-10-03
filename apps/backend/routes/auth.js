import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../config/database.js";

const router = express.Router();

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 1 }), // Reduced minimum length for testing
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const userResult = await pool.query(
        "SELECT id, name, email, password, role FROM users WHERE email = $1",
        [email],
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = userResult.rows[0];

      // Check password - handle both hashed and plain text for mock data
      let isValidPassword = false;
      if (
        user.password.startsWith("$2a$") ||
        user.password.startsWith("$2b$")
      ) {
        // Hashed password
        isValidPassword = await bcrypt.compare(password, user.password);
      } else {
        // Plain text password for mock data
        isValidPassword = password === user.password;
      }

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name || user.username || "User",
          email: user.email,
          role: user.role,
        },
      });
    } catch (_error) {
      console.error("Login error:", _error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Verify token route
router.get("/verify", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Verify user still exists
    const user = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [decoded.userId],
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      valid: true,
      user: {
        ...user.rows[0],
        name: user.rows[0].name || user.rows[0].username || "User",
      },
    });
  } catch (_error) {
    res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
    });
  }
});

export default router;
