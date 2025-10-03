const request = require("supertest");
const express = require("express");

// Create test app
const app = express();
app.use(express.json());

// Mock auth routes for testing
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  res.status(200).json({ message: "Login successful" });
});

describe("Auth Routes", () => {
  describe("POST /api/auth/login", () => {
    test("should return 400 for missing email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "testpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("should return 400 for missing password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("should return 400 for invalid email format", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "testpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("should return 200 for valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "testpassword",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });
  });
});

describe("Basic Jest Setup", () => {
  test("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should have access to environment variables", () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(process.env.JWT_SECRET).toBe("test-secret-key-for-jest");
  });
});
