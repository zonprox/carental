import database from "../config/database.js";
import bcrypt from "bcryptjs";

async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Create users table with enhanced schema
    await database.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cars table with complete schema
    await database.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        fuel_type VARCHAR(50) NOT NULL,
        transmission VARCHAR(50) NOT NULL,
        seats INTEGER NOT NULL,
        price_per_day DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        description TEXT,
        features TEXT,
        location VARCHAR(255),
        mileage INTEGER,
        license_plate VARCHAR(20),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await database.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        car_id INTEGER REFERENCES cars(id),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await database.query(`
      CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(available);
      CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
      CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
    `);

    console.log("✅ Database tables created successfully!");

    // Insert default admin user if not exists
    const adminExists = await database.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@carental.com"]
    );

    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await database.query(
        `INSERT INTO users (email, password, name, role, phone, address) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          "admin@carental.com",
          hashedPassword,
          "Administrator",
          "admin",
          "0901234567",
          "TP.HCM"
        ]
      );
      console.log("✅ Default admin user created!");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Insert sample cars data
    const sampleCars = [
      [
        "Toyota Camry 2023",
        "Toyota",
        "Camry",
        2023,
        "Sedan",
        "Xăng",
        "Automatic",
        5,
        800000,
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
        "Sedan hạng trung cao cấp với thiết kế hiện đại và tiết kiệm nhiên liệu",
        '["GPS Navigation","Bluetooth","Air Conditioning","Backup Camera"]',
        "TP.HCM",
        15000,
        "51A-12345",
        true
      ],
      [
        "Honda CR-V 2023",
        "Honda",
        "CR-V",
        2023,
        "SUV",
        "Xăng",
        "CVT",
        7,
        1200000,
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500",
        "SUV 7 chỗ với không gian rộng rãi và tính năng an toàn Honda SENSING",
        '["Honda SENSING","7 Seats","Sunroof","Leather Seats"]',
        "Đà Nẵng",
        12000,
        "43A-67890",
        true
      ],
      [
        "Ford EcoSport 2023",
        "Ford",
        "EcoSport",
        2023,
        "SUV",
        "Xăng",
        "Automatic",
        5,
        900000,
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500",
        "SUV compact với thiết kế trẻ trung và khả năng vận hành linh hoạt",
        '["SYNC 3","Reverse Camera","Cruise Control","Keyless Entry"]',
        "Hà Nội",
        18000,
        "30A-11111",
        true
      ]
    ];

    for (const car of sampleCars) {
      const existingCar = await database.query(
        "SELECT id FROM cars WHERE license_plate = $1",
        [car[15]]
      );

      if (existingCar.rows.length === 0) {
        await database.query(
          `INSERT INTO cars (
            name, brand, model, year, type, fuel_type, transmission, seats,
            price_per_day, image_url, description, features, location,
            mileage, license_plate, available
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          car
        );
      }
    }

    console.log("✅ Sample data inserted successfully!");
    console.log("🎉 Database initialization completed!");

  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
    .then(() => {
      console.log("✅ Database initialization completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database initialization failed:", error);
      process.exit(1);
    });
}

export { initDatabase };