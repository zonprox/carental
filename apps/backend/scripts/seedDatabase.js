import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load mock data
const mockDataPath = path.join(__dirname, "../data/mock-database.json");
const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf8"));

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || "carental_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "carental_dev",
  password: process.env.DB_PASSWORD || "carental_password",
  port: process.env.DB_PORT || 5432,
});

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await client.query("DELETE FROM cars WHERE id > 0");
    await client.query("DELETE FROM users WHERE id > 0");
    console.log("🗑️  Cleared existing data");

    // Reset auto-increment sequences
    await client.query("ALTER SEQUENCE cars_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    console.log("🔄 Reset ID sequences");

    // Insert sample cars from mock data
    console.log("🚗 Inserting cars...");
    for (const car of mockData.cars) {
      const query = `
        INSERT INTO cars (
          name, brand, model, year, type, fuel_type, transmission, seats, 
          price_per_day, image_url, description, features, location, 
          mileage, license_plate, available, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `;
      
      const values = [
        car.name,
        car.brand,
        car.model,
        car.year,
        car.type,
        car.fuel_type,
        car.transmission,
        car.seats,
        car.price_per_day,
        car.image_url,
        car.description,
        Array.isArray(car.features) ? JSON.stringify(car.features) : car.features,
        car.location,
        car.mileage,
        car.license_plate,
        car.available,
        car.created_at,
        car.updated_at
      ];

      await client.query(query, values);
    }
    console.log(`✅ Inserted ${mockData.cars.length} cars`);

    // Insert sample users from mock data
    console.log("👥 Inserting users...");
    for (const user of mockData.users) {
      const query = `
        INSERT INTO users (
          email, password, name, role, phone, address, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      
      // Use password_hash if available, otherwise use password
      const password = user.password_hash || user.password || 'defaultpassword';
      
      const values = [
        user.email,
        password,
        user.name,
        user.role,
        user.phone || null,
        user.address || null,
        user.created_at,
        user.updated_at
      ];

      await client.query(query, values);
    }
    console.log(`✅ Inserted ${mockData.users.length} users`);

    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
