-- Car Rental Database Schema

-- Create database (run this separately if needed)
-- CREATE DATABASE carental_db;

-- Connect to the database
-- \c carental_db;

-- Create cars table with enhanced fields
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    color VARCHAR(30) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day > 0),
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(20) DEFAULT 'sedan' CHECK (category IN ('sedan', 'suv', 'luxury', 'sports', 'compact', 'electric', 'wagon')),
    fuel_type VARCHAR(20) DEFAULT 'gasoline' CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
    seats INTEGER DEFAULT 5 CHECK (seats >= 2 AND seats <= 8),
    transmission VARCHAR(20) DEFAULT 'automatic' CHECK (transmission IN ('automatic', 'manual', 'cvt')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table for future rental functionality
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(available);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- Note: In production, use a stronger password and proper hashing
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@carental.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Add some sample data comments
-- Sample cars will be added via the seeding script
-- Run: npm run seed (from server directory)