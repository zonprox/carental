-- Car Rental Database Schema - Production Ready
-- Optimized for performance, scalability, and data integrity

-- Create database (run this separately if needed)
-- CREATE DATABASE carental_db;

-- Connect to the database
-- \c carental_db;

-- Enable extensions for better performance and functionality
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create cars table with enhanced fields and optimizations
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
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
    mileage INTEGER DEFAULT 0 CHECK (mileage >= 0),
    license_plate VARCHAR(20) UNIQUE,
    location VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    total_bookings INTEGER DEFAULT 0 CHECK (total_bookings >= 0),
    maintenance_status VARCHAR(20) DEFAULT 'good' CHECK (maintenance_status IN ('excellent', 'good', 'fair', 'needs_service')),
    last_service_date DATE,
    next_service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- Soft delete support
);

-- Create users table for admin authentication with enhanced security
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'user', 'manager')),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- Soft delete support
);

-- Create customers table for rental customers
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    driver_license VARCHAR(50) UNIQUE,
    license_expiry DATE,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.0,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create bookings table with enhanced functionality and partitioning
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    car_id INTEGER REFERENCES cars(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE RESTRICT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_location VARCHAR(200),
    dropoff_location VARCHAR(200),
    total_days INTEGER GENERATED ALWAYS AS (end_date - start_date) STORED,
    base_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.0,
    tax_amount DECIMAL(10,2) DEFAULT 0.0,
    total_price DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded', 'failed')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'online')),
    special_requests TEXT,
    notes TEXT,
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date > start_date),
    CONSTRAINT valid_total_price CHECK (total_price >= 0),
    CONSTRAINT valid_deposit CHECK (deposit_amount >= 0)
) PARTITION BY RANGE (created_at);

-- Create partitions for bookings table (monthly partitions for better performance)
CREATE TABLE IF NOT EXISTS bookings_2024 PARTITION OF bookings
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE IF NOT EXISTS bookings_2025 PARTITION OF bookings
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS bookings_2026 PARTITION OF bookings
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Create payments table for financial tracking
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'full_payment', 'refund', 'penalty')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'online')),
    transaction_id VARCHAR(100),
    gateway_response JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table for customer feedback
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance_logs table for car maintenance tracking
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2) DEFAULT 0.0,
    service_provider VARCHAR(100),
    scheduled_date DATE,
    completed_date DATE,
    next_service_date DATE,
    mileage_at_service INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comprehensive indexes for optimal performance
-- Primary entity indexes
CREATE INDEX IF NOT EXISTS idx_cars_uuid ON cars(uuid);
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(available) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price_per_day);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);
CREATE INDEX IF NOT EXISTS idx_cars_rating ON cars(rating);
CREATE INDEX IF NOT EXISTS idx_cars_maintenance ON cars(maintenance_status);
CREATE INDEX IF NOT EXISTS idx_cars_deleted ON cars(deleted_at) WHERE deleted_at IS NULL;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cars_available_category ON cars(available, category) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_cars_available_price ON cars(available, price_per_day) WHERE available = true;
CREATE INDEX IF NOT EXISTS idx_cars_location_available ON cars(location, available) WHERE available = true;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cars_search ON cars USING gin(to_tsvector('english', make || ' ' || model || ' ' || COALESCE(description, '')));

-- JSONB indexes for features
CREATE INDEX IF NOT EXISTS idx_cars_features ON cars USING gin(features);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

-- Customers table indexes
CREATE INDEX IF NOT EXISTS idx_customers_uuid ON customers(uuid);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_license ON customers(driver_license);
CREATE INDEX IF NOT EXISTS idx_customers_verified ON customers(is_verified);
CREATE INDEX IF NOT EXISTS idx_customers_deleted ON customers(deleted_at) WHERE deleted_at IS NULL;

-- Bookings table indexes (will be inherited by partitions)
CREATE INDEX IF NOT EXISTS idx_bookings_uuid ON bookings(uuid);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Composite indexes for complex booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_car_dates ON bookings(car_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_status ON bookings(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status_dates ON bookings(status, start_date, end_date);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_uuid ON payments(uuid);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_uuid ON reviews(uuid);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published) WHERE is_published = true;

-- Maintenance logs indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_uuid ON maintenance_logs(uuid);
CREATE INDEX IF NOT EXISTS idx_maintenance_car_id ON maintenance_logs(car_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_type ON maintenance_logs(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_logs(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON maintenance_logs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_next_service ON maintenance_logs(next_service_date);

-- Create advanced functions and triggers for production
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update car rating based on reviews
CREATE OR REPLACE FUNCTION update_car_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cars 
    SET rating = (
        SELECT COALESCE(AVG(rating), 0.0)
        FROM reviews 
        WHERE car_id = COALESCE(NEW.car_id, OLD.car_id) 
        AND is_published = true
    )
    WHERE id = COALESCE(NEW.car_id, OLD.car_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to update customer statistics
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE customers 
        SET 
            total_bookings = (
                SELECT COUNT(*) 
                FROM bookings 
                WHERE customer_id = NEW.customer_id 
                AND status IN ('completed', 'active')
            ),
            total_spent = (
                SELECT COALESCE(SUM(total_price), 0.0)
                FROM bookings 
                WHERE customer_id = NEW.customer_id 
                AND status = 'completed'
            )
        WHERE id = NEW.customer_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to update car booking statistics
CREATE OR REPLACE FUNCTION update_car_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE cars 
        SET total_bookings = (
            SELECT COUNT(*) 
            FROM bookings 
            WHERE car_id = NEW.car_id 
            AND status IN ('completed', 'active')
        )
        WHERE id = NEW.car_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to prevent overlapping bookings
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for overlapping bookings
    IF EXISTS (
        SELECT 1 FROM bookings 
        WHERE car_id = NEW.car_id 
        AND status IN ('confirmed', 'active')
        AND id != COALESCE(NEW.id, 0)
        AND (
            (NEW.start_date BETWEEN start_date AND end_date) OR
            (NEW.end_date BETWEEN start_date AND end_date) OR
            (start_date BETWEEN NEW.start_date AND NEW.end_date)
        )
    ) THEN
        RAISE EXCEPTION 'Car is not available for the selected dates';
    END IF;
    
    -- Update car availability if booking is confirmed
    IF NEW.status = 'confirmed' THEN
        UPDATE cars SET available = false WHERE id = NEW.car_id;
    ELSIF OLD.status = 'confirmed' AND NEW.status IN ('completed', 'cancelled') THEN
        UPDATE cars SET available = true WHERE id = NEW.car_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function for soft delete
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for business logic
CREATE TRIGGER trigger_update_car_rating 
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_car_rating();

CREATE TRIGGER trigger_update_customer_stats 
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

CREATE TRIGGER trigger_update_car_stats 
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_car_stats();

CREATE TRIGGER trigger_check_booking_availability 
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION check_booking_availability();

-- Create views for common queries
CREATE OR REPLACE VIEW available_cars AS
SELECT 
    c.*,
    COALESCE(AVG(r.rating), 0.0) as avg_rating,
    COUNT(r.id) as review_count
FROM cars c
LEFT JOIN reviews r ON c.id = r.car_id AND r.is_published = true
WHERE c.available = true 
AND c.deleted_at IS NULL
AND c.maintenance_status IN ('excellent', 'good')
GROUP BY c.id;

CREATE OR REPLACE VIEW booking_summary AS
SELECT 
    b.*,
    c.make || ' ' || c.model as car_name,
    c.license_plate,
    cust.name as customer_name,
    cust.phone as customer_phone,
    p.amount as paid_amount,
    p.status as payment_status
FROM bookings b
JOIN cars c ON b.car_id = c.id
LEFT JOIN customers cust ON b.customer_id = cust.id
LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_type = 'full_payment';

-- Create materialized view for analytics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS car_performance_stats AS
SELECT 
    c.id,
    c.make,
    c.model,
    c.year,
    c.category,
    COUNT(b.id) as total_bookings,
    COALESCE(SUM(b.total_price), 0) as total_revenue,
    COALESCE(AVG(b.total_price), 0) as avg_booking_value,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count,
    MAX(b.created_at) as last_booking_date
FROM cars c
LEFT JOIN bookings b ON c.id = b.car_id AND b.status = 'completed'
LEFT JOIN reviews r ON c.id = r.car_id AND r.is_published = true
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.make, c.model, c.year, c.category;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_car_performance_stats_id ON car_performance_stats(id);

-- Insert default admin user (password: admin123)
-- Note: In production, use a stronger password and proper hashing
INSERT INTO users (username, name, email, password_hash, role) 
VALUES ('admin', 'Quản Trị Viên', 'admin@carental.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Add some sample data comments
-- Sample cars will be added via the seeding script
-- Run: npm run seed (from server directory)