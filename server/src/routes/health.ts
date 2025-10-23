import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  try {
    // Check if app is configured
    const configuredFlag = await prisma.appConfig.findUnique({
      where: { key: 'configured' },
    });
    
    const isConfigured = configuredFlag?.value === 'true';
    
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: isConfigured ? 'ok' : 'needs_setup',
      timestamp: new Date().toISOString(),
      database: 'connected',
      configured: isConfigured,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
