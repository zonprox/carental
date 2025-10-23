import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

export async function setupGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const configuredFlag = await prisma.appConfig.findUnique({
      where: { key: 'configured' },
    });
    
    if (configuredFlag?.value !== 'true') {
      return res.status(503).json({
        error: 'Application not configured',
        message: 'Please complete setup first',
      });
    }
    
    next();
  } catch (_error) {
    res.status(500).json({ error: 'Setup check failed' });
  }
}
