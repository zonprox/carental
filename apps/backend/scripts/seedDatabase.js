const { Pool } = require("pg");
const sampleCars = require("../data/sampleCars");

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || "carental_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "carental_db",
  password: process.env.DB_PASSWORD || "carental_password",
  port: process.env.DB_PORT || 5432,
});

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing cars (optional - comment out if you want to keep existing data)
    await client.query("DELETE FROM cars WHERE id > 0");
    console.log("🗑️  Cleared existing car data");

    // Reset auto-increment sequence
    await client.query("ALTER SEQUENCE cars_id_seq RESTART WITH 1");
    console.log("🔄 Reset ID sequence");

    // Insert sample cars
    for (const car of sampleCars) {
      const query = `
        INSERT INTO cars (
          make, model, year, color, price_per_day, available, 
          image_url, description, features, category, fuel_type, 
          seats, transmission
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;

      const values = [
        car.make,
        car.model,
        car.year,
        car.color,
        car.price_per_day,
        car.available,
        car.image_url,
        car.description,
        JSON.stringify(car.features),
        car.category,
        car.fuel_type,
        car.seats,
        car.transmission,
      ];

      await client.query(query, values);
      console.log(`✅ Added ${car.year} ${car.make} ${car.model}`);
    }

    // Get count of inserted cars
    const result = await client.query("SELECT COUNT(*) FROM cars");
    const count = result.rows[0].count;

    console.log(`🎉 Successfully seeded database with ${count} cars!`);
    console.log("📊 Database seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✨ Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
