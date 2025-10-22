import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../shared/env.js';
import { healthRouter } from './routes/health.js';
import { setupRouter } from './routes/setup.js';
import { authRouter } from './routes/auth.js';
import { carsRouter } from './routes/cars.js';
import { bookingsRouter } from './routes/bookings.js';
import { usersRouter } from './routes/users.js';
import { setupGuard } from './middleware/setupGuard.js';
import { settingsRouter } from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & parsing middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: env.APP_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes (health & setup don't require setup guard)
app.use('/api/health', healthRouter);
app.use('/api/setup', setupRouter);

// Protected API routes (require app setup)
app.use('/api/auth', setupGuard, authRouter);

// Public routes (no setup guard needed) 
app.use('/api/cars', carsRouter);
app.use('/api/bookings', setupGuard, bookingsRouter);
app.use('/api/users', setupGuard, usersRouter);
app.use('/api/settings', setupGuard, settingsRouter);

// Serve uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Serve static frontend in production
if (env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  // Fallback to index.html for client-side routing
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});
