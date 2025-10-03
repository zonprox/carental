import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MockDatabase {
  constructor() {
    this.dataPath = path.join(__dirname, "../data/mock-database.json");
    this.data = this.loadData();
  }

  loadData() {
    try {
      const rawData = fs.readFileSync(this.dataPath, "utf8");
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error loading mock database:", error);
      return { users: [], cars: [] };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error("Error saving mock database:", error);
    }
  }

  // Simulate PostgreSQL query interface
  async query(sql, params = []) {
    // Simulate async behavior
    await new Promise((resolve) => setTimeout(resolve, 10));

    const sqlLower = sql.toLowerCase().trim();

    // Handle SELECT queries
    if (sqlLower.startsWith("select")) {
      return this.handleSelect(sql, params);
    }

    // Handle INSERT queries
    if (sqlLower.startsWith("insert")) {
      return this.handleInsert(sql, params);
    }

    // Handle UPDATE queries
    if (sqlLower.startsWith("update")) {
      return this.handleUpdate(sql, params);
    }

    // Handle DELETE queries
    if (sqlLower.startsWith("delete")) {
      return this.handleDelete(sql, params);
    }

    // Default response for other queries (CREATE TABLE, etc.)
    return { rows: [], rowCount: 0 };
  }

  handleSelect(sql, params) {
    const sqlLower = sql.toLowerCase();

    // Handle user queries
    if (sqlLower.includes("from users")) {
      if (sqlLower.includes("where email = $1")) {
        const email = params[0];
        const user = this.data.users.find((u) => u.email === email);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }

      if (sqlLower.includes("where id = $1")) {
        const id = parseInt(params[0]);
        const user = this.data.users.find((u) => u.id === id);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }

      // Return all users
      return { rows: this.data.users, rowCount: this.data.users.length };
    }

    // Handle car queries
    if (sqlLower.includes("from cars")) {
      let cars = [...this.data.cars];

      // Handle WHERE clauses
      if (sqlLower.includes("where available = true")) {
        cars = cars.filter((car) => car.available === true);
      }

      if (sqlLower.includes("where id = $1")) {
        const id = parseInt(params[0]);
        cars = cars.filter((car) => car.id === id);
      }

      // Handle ORDER BY
      if (sqlLower.includes("order by")) {
        if (sqlLower.includes("created_at desc")) {
          cars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        if (sqlLower.includes("price_per_day")) {
          cars.sort((a, b) => a.price_per_day - b.price_per_day);
        }
      }

      // Handle LIMIT
      if (sqlLower.includes("limit")) {
        const limitMatch = sql.match(/limit\s+(\d+)/i);
        if (limitMatch) {
          const limit = parseInt(limitMatch[1]);
          cars = cars.slice(0, limit);
        }
      }

      return { rows: cars, rowCount: cars.length };
    }

    return { rows: [], rowCount: 0 };
  }

  handleInsert(sql, params) {
    const sqlLower = sql.toLowerCase();

    if (sqlLower.includes("into users")) {
      const newUser = {
        id: Math.max(...this.data.users.map((u) => u.id), 0) + 1,
        email: params[0],
        password_hash: params[1],
        role: params[2] || "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.data.users.push(newUser);
      this.saveData();
      return { rows: [newUser], rowCount: 1 };
    }

    if (sqlLower.includes("into cars")) {
      const newCar = {
        id: Math.max(...this.data.cars.map((c) => c.id), 0) + 1,
        name: params[0],
        brand: params[1],
        year: params[2],
        seats: params[3],
        fuel_type: params[4],
        price_per_day: params[5],
        image_url: params[6],
        location: params[7],
        available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.data.cars.push(newCar);
      this.saveData();
      return { rows: [newCar], rowCount: 1 };
    }

    return { rows: [], rowCount: 0 };
  }

  handleUpdate(sql, params) {
    const sqlLower = sql.toLowerCase();

    // Handle user updates
    if (sqlLower.includes("users") && sqlLower.includes("set")) {
      // Parse the SQL to understand which fields are being updated
      const userId = parseInt(params[params.length - 1]); // Last parameter is always the ID
      const userIndex = this.data.users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        const user = { ...this.data.users[userIndex] };

        // Parse the SET clause to determine which fields to update
        const setClause = sql.match(/SET\s+(.*?)\s+WHERE/i);
        if (setClause) {
          const fields = setClause[1].split(",").map((f) => f.trim());
          let paramIndex = 0;

          fields.forEach((field) => {
            const fieldName = field.split("=")[0].trim();
            const value = params[paramIndex++];

            switch (fieldName) {
              case "name":
                user.name = value;
                break;
              case "email":
                user.email = value;
                break;
              case "password":
                user.password_hash = value;
                break;
              case "phone":
                user.phone = value;
                break;
              case "address":
                user.address = value;
                break;
              case "role":
                user.role = value;
                break;
            }
          });
        }

        user.updated_at = new Date().toISOString();
        this.data.users[userIndex] = user;
        this.saveData();

        // Return user without password fields for security
        const {
          password: _password,
          password_hash: _password_hash,
          ...safeUser
        } = user;
        return { rows: [safeUser], rowCount: 1 };
      }
    }

    // Handle car availability update
    if (sqlLower.includes("cars") && sqlLower.includes("available")) {
      const available = params[0];
      const id = parseInt(params[1]);

      const carIndex = this.data.cars.findIndex((c) => c.id === id);
      if (carIndex !== -1) {
        this.data.cars[carIndex].available = available;
        this.data.cars[carIndex].updated_at = new Date().toISOString();
        this.saveData();
        return { rows: [this.data.cars[carIndex]], rowCount: 1 };
      }
    }

    // Handle full car update
    if (
      sqlLower.includes("cars") &&
      sqlLower.includes("set") &&
      sqlLower.includes("name")
    ) {
      // Extract parameters for full car update
      // Expected params: [name, brand, year, seats, fuel_type, price_per_day, image_url, location, id]
      const [
        name,
        brand,
        year,
        seats,
        fuel_type,
        price_per_day,
        image_url,
        location,
        id,
      ] = params;
      const carId = parseInt(id);

      const carIndex = this.data.cars.findIndex((c) => c.id === carId);
      if (carIndex !== -1) {
        this.data.cars[carIndex] = {
          ...this.data.cars[carIndex],
          name,
          brand,
          year: parseInt(year),
          seats: parseInt(seats),
          fuel_type,
          price_per_day: parseFloat(price_per_day),
          image_url: image_url || this.data.cars[carIndex].image_url,
          location: location || this.data.cars[carIndex].location,
          updated_at: new Date().toISOString(),
        };
        this.saveData();
        return { rows: [this.data.cars[carIndex]], rowCount: 1 };
      }
    }

    return { rows: [], rowCount: 0 };
  }

  handleDelete(_sql, _params) {
    // Handle delete operations if needed
    return { rows: [], rowCount: 0 };
  }

  // Additional helper methods
  async connect() {
    return this;
  }

  async end() {
    // No-op for mock database
  }
}

// Create singleton instance
const mockDb = new MockDatabase();

export default mockDb;
