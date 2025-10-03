const pool = require("../config/database");
const bcrypt = require("bcryptjs");

async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cars table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        seats INTEGER NOT NULL,
        fuel_type VARCHAR(50) NOT NULL,
        price_per_day DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        location VARCHAR(255),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand)",
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(available)",
    );
    await pool.query(
      "CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day)",
    );

    // Check if admin user exists
    const adminExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@carental.com"],
    );

    if (adminExists.rows.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await pool.query(
        "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
        ["admin@carental.com", hashedPassword, "admin"],
      );
      console.log("Admin user created: admin@carental.com / admin123");
    }

    // Check if sample cars exist
    const carsCount = await pool.query("SELECT COUNT(*) FROM cars");

    if (parseInt(carsCount.rows[0].count) === 0) {
      // Insert sample cars
      const sampleCars = [
        [
          "Toyota Camry 2023",
          "Toyota",
          2023,
          5,
          "Xăng",
          800000,
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
          "Hà Nội",
        ],
        [
          "Honda Civic 2022",
          "Honda",
          2022,
          5,
          "Xăng",
          750000,
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
          "Hà Nội",
        ],
        [
          "Mazda CX-5 2023",
          "Mazda",
          2023,
          7,
          "Xăng",
          1200000,
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500",
          "Hồ Chí Minh",
        ],
        [
          "Hyundai Elantra 2022",
          "Hyundai",
          2022,
          5,
          "Xăng",
          700000,
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500",
          "Đà Nẵng",
        ],
        [
          "Ford EcoSport 2023",
          "Ford",
          2023,
          5,
          "Xăng",
          900000,
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
          "Hà Nội",
        ],
      ];

      for (const car of sampleCars) {
        await pool.query(
          "INSERT INTO cars (name, brand, year, seats, fuel_type, price_per_day, image_url, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          car,
        );
      }
      console.log("Sample cars data inserted");
    }

    console.log("Database initialization completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDatabase();
