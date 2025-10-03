import request from "supertest";
import express from "express";

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
    test("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });

    test("should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password is required");
    });

    test("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "invalid-email", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email format");
    });

    test("should return 200 for valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });

    test("should handle empty request body", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });
  });
});

describe("Basic Jest Setup", () => {
  test("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should handle async operations", async () => {
    const result = await Promise.resolve("test");
    expect(result).toBe("test");
  });
});
