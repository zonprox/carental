import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { validateRequest } from '../middleware/validation.js';

export const setupRouter = Router();

const setupSchema = z.object({
  appUrl: z.string().url(),
  serverPort: z.number().int().min(1).max(65535),
  clientPort: z.number().int().min(1).max(65535),
  dbMode: z.enum(['local', 'external']),
  dbHost: z.string().optional(),
  dbPort: z.number().int().optional(),
  dbName: z.string().optional(),
  dbUser: z.string().optional(),
  dbPassword: z.string().optional(),
  dbSslMode: z.string().optional(),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  adminName: z.string().min(1),
});

const testDbSchema = z.object({
  dbHost: z.string(),
  dbPort: z.number().int(),
  dbName: z.string(),
  dbUser: z.string(),
  dbPassword: z.string(),
  dbSslMode: z.string().optional(),
});

setupRouter.get('/', async (req, res) => {
  try {
    const config = await prisma.appConfig.findMany();
    const configMap = Object.fromEntries(config.map((c: any) => [c.key, c.value]));
    
    res.json({
      configured: configMap.configured === 'true',
      config: {
        appUrl: configMap.app_url,
        serverPort: configMap.server_port ? parseInt(configMap.server_port) : undefined,
        clientPort: configMap.client_port ? parseInt(configMap.client_port) : undefined,
        dbMode: configMap.db_mode,
      },
    });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to fetch setup config' });
  }
});

setupRouter.post('/', validateRequest(setupSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof setupSchema>;
    
    // Save configuration
    const configUpdates = [
      { key: 'app_url', value: data.appUrl },
      { key: 'server_port', value: data.serverPort.toString() },
      { key: 'client_port', value: data.clientPort.toString() },
      { key: 'db_mode', value: data.dbMode },
    ];
    
    if (data.dbMode === 'external') {
      configUpdates.push(
        { key: 'db_host', value: data.dbHost || '' },
        { key: 'db_port', value: data.dbPort?.toString() || '' },
        { key: 'db_name', value: data.dbName || '' },
        { key: 'db_user', value: data.dbUser || '' },
        { key: 'db_sslmode', value: data.dbSslMode || 'prefer' }
      );
    }
    
    for (const config of configUpdates) {
      await prisma.appConfig.upsert({
        where: { key: config.key },
        create: config,
        update: { value: config.value },
      });
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10);
    await prisma.user.upsert({
      where: { email: data.adminEmail },
      create: {
        email: data.adminEmail,
        name: data.adminName,
        password: hashedPassword,
        isAdmin: true,
      },
      update: {
        name: data.adminName,
        password: hashedPassword,
        isAdmin: true,
      },
    });
    
    // Mark as configured
    await prisma.appConfig.upsert({
      where: { key: 'configured' },
      create: { key: 'configured', value: 'true' },
      update: { value: 'true' },
    });
    
    res.json({ success: true, message: 'Setup completed successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Failed to complete setup' });
  }
});

setupRouter.post('/test-db', validateRequest(testDbSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof testDbSchema>;
    const sslMode = data.dbSslMode || 'prefer';
    const connectionString = `postgresql://${data.dbUser}:${data.dbPassword}@${data.dbHost}:${data.dbPort}/${data.dbName}?sslmode=${sslMode}`;
    
    const testClient = new PrismaClient({
      datasources: { db: { url: connectionString } },
    });
    
    await testClient.$connect();
    await testClient.$queryRaw`SELECT 1`;
    await testClient.$disconnect();
    
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Database connection failed',
    });
  }
});
