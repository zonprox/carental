import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-jest";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "5432";
process.env.DB_NAME = "carental_test";
process.env.DB_USER = "carental_user";
process.env.DB_PASSWORD = "carental_password";

// Global test timeout
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
  console.log("🧪 Starting test suite...");
});

// Global test cleanup
afterAll(async () => {
  // Any global cleanup can go here
  console.log("✅ Test suite completed");
});
