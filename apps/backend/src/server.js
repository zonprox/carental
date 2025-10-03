import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import winston from "winston";

// Configure dotenv
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'carental-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import authRoutes from "../routes/auth.js";
import carsRoutes from "../routes/cars.js";
import usersRoutes from "../routes/users.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy if behind reverse proxy (for Docker/nginx/etc)
app.set("trust proxy", 1);

// Request logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Security middleware with production-ready configuration
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : isProduction 
    ? [] // Must be explicitly configured in production
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          ...(isProduction ? [] : [
            "http://localhost:3000",
            "http://localhost:3001", 
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "ws://localhost:3000",
            "ws://127.0.0.1:3000",
          ])
        ],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'", // Required for CSS-in-JS libraries
          "https://fonts.googleapis.com"
        ],
        scriptSrc: [
          "'self'",
          ...(isProduction ? [
            // Add specific script hashes or nonces for production
          ] : [
            "'unsafe-inline'",
            "'unsafe-eval'",
            "http://localhost:3000",
          ])
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        mediaSrc: ["'self'", "data:", "blob:"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: isProduction ? {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    } : false,
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
  }),
);

// Enhanced rate limiting with different tiers
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: message });
  }
});

// Different rate limits for different endpoints
app.use("/api/auth", createRateLimit(
  15 * 60 * 1000, // 15 minutes
  isProduction ? 5 : 50, // 5 login attempts per 15 min in production
  "Too many authentication attempts, please try again later."
));

app.use("/api/", createRateLimit(
  15 * 60 * 1000, // 15 minutes
  isProduction ? 100 : 1000, // General API rate limit
  "Too many requests from this IP, please try again later."
));

// Compression middleware with configuration
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
}));

// CORS configuration with strict production settings
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (isProduction) {
      if (allowedOrigins.length === 0) {
        logger.error('ALLOWED_ORIGINS not configured for production');
        return callback(new Error('CORS not configured'), false);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
      }
    } else {
      // Development: allow localhost origins
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: isProduction ? "1mb" : "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: isProduction ? "1mb" : "10mb" 
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/users", usersRoutes);

// Health check endpoint with detailed status
app.get("/api/health", (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    memory: process.memoryUsage(),
    pid: process.pid,
  };
  
  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error("Health check failed:", error);
    healthCheck.message = error.message;
    res.status(503).json(healthCheck);
  }
});

// Metrics endpoint for monitoring (basic implementation)
app.get("/api/metrics", (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  };
  
  res.status(200).json(metrics);
});

// Serve static files in production
if (isProduction) {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Development 404 handler
  app.use((req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      error: "Route not found",
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  });
}

// Global error handling middleware
app.use((error, req, res, _next) => {
  logger.error("Unhandled error:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't leak error details in production
  const isDev = !isProduction;
  
  res.status(error.status || 500).json({
    error: isDev ? error.message : "Internal server error",
    ...(isDev && { stack: error.stack }),
    timestamp: new Date().toISOString(),
    requestId: req.id || Math.random().toString(36).substr(2, 9),
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 CarRental API Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
  
  if (!isProduction) {
    logger.info(`🌐 Frontend URL: http://localhost:3000`);
    logger.info(`📋 Health Check: http://localhost:${PORT}/api/health`);
    logger.info(`📈 Metrics: http://localhost:${PORT}/api/metrics`);
  }
});

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;