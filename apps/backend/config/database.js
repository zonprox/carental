import { Pool } from "pg";
import mockDatabase from "../services/mockDatabase.js";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

// Configure logger for database operations
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'carental-db' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const useMockDb = process.env.USE_MOCK_DB === "true" || (!isProduction && !process.env.DATABASE_URL && !process.env.DB_HOST);

let pool = null;

// PostgreSQL Configuration with Connection Pooling
const createPostgreSQLPool = () => {
  const config = {
    user: process.env.DB_USER || "carental_user",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "carental_db",
    password: process.env.DB_PASSWORD || "carental_password",
    port: parseInt(process.env.DB_PORT) || 5432,
    
    // Connection Pool Configuration
    max: isProduction ? 20 : 10, // Maximum number of clients in the pool
    min: isProduction ? 5 : 2,   // Minimum number of clients in the pool
    idleTimeoutMillis: 30000,    // Close idle clients after 30 seconds
    connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
    maxUses: 7500,               // Close (and replace) a connection after it has been used 7500 times
    
    // SSL Configuration for production
    ssl: isProduction ? {
      rejectUnauthorized: false, // Set to true in production with proper certificates
      ca: process.env.DB_SSL_CA,
      key: process.env.DB_SSL_KEY,
      cert: process.env.DB_SSL_CERT,
    } : false,
    
    // Query timeout
    query_timeout: 60000,
    statement_timeout: 60000,
    
    // Application name for monitoring
    application_name: `carental-api-${process.env.NODE_ENV || 'development'}`,
  };

  const pgPool = new Pool(config);

  // Handle pool events
  pgPool.on('connect', (client) => {
    logger.info('New PostgreSQL client connected');
    
    // Set session configuration
    client.query(`
      SET timezone = 'UTC';
      SET statement_timeout = '60s';
      SET lock_timeout = '30s';
    `).catch(err => logger.error('Error setting session config:', err));
  });

  pgPool.on('error', (err) => {
    logger.error('PostgreSQL pool error:', err);
  });

  pgPool.on('remove', () => {
    logger.info('PostgreSQL client removed from pool');
  });

  return pgPool;
};

// Database Connection with Retry Logic
const connectWithRetry = async (maxRetries = 5, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (useMockDb) {
        logger.info('Using Mock Database (JSON-based) for development');
        return mockDatabase;
      }

      // Use PostgreSQL as primary database
      if (process.env.DB_HOST || process.env.DB_USER || process.env.DATABASE_URL) {
        pool = createPostgreSQLPool();
        
        // Test connection
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        
        logger.info('Database connection established (PostgreSQL)');
        return pool;
      }

      // Fallback to mock database if no configuration found
      logger.warn('No database configuration found, falling back to Mock Database');
      return mockDatabase;

    } catch (error) {
      logger.error(`Database connection attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        if (!isTest) {
          logger.error('All database connection attempts failed, using Mock Database as fallback');
          return mockDatabase;
        }
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Health Check Function
const checkDatabaseHealth = async () => {
  try {
    if (useMockDb) {
      return { status: 'healthy', type: 'mock', uptime: process.uptime() };
    }

    if (pool) {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      return { 
        status: 'healthy', 
        type: 'postgresql', 
        uptime: process.uptime(),
        currentTime: result.rows[0].current_time 
      };
    }

    return { status: 'unhealthy', type: 'unknown' };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

// Graceful Shutdown
const closeDatabase = async () => {
  try {
    if (pool) {
      await pool.end();
      logger.info('PostgreSQL pool closed');
    }
  } catch (error) {
    logger.error('Error closing database connections:', error);
  }
};

// Initialize database connection
const database = await connectWithRetry();

// Export database instance and utilities
export default database;
export { checkDatabaseHealth, closeDatabase, logger as dbLogger };
