import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Settings validation schemas
const settingsSchema = z.object({
  // SMTP Settings
  smtp_enabled: z.boolean().optional(),
  smtp_host: z.string().optional(),
  smtp_port: z.string().optional(),
  smtp_secure: z.boolean().optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_from_email: z.string().email().optional(),
  smtp_from_name: z.string().optional(),
  
  // General Settings
  site_name: z.string().optional(),
  site_description: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  
  // Booking Settings
  min_booking_days: z.string().optional(),
  max_booking_days: z.string().optional(),
  advance_booking_days: z.string().optional(),
  auto_approve_bookings: z.boolean().optional(),
  
  // Notification Settings
  email_notifications: z.boolean().optional(),
  sms_notifications: z.boolean().optional(),
  booking_notifications: z.boolean().optional(),
  payment_notifications: z.boolean().optional(),
  
  // Security Settings
  require_email_verification: z.boolean().optional(),
  require_phone_verification: z.boolean().optional(),
  enable_two_factor: z.boolean().optional(),
  session_timeout: z.string().optional(),
});

// GET /api/settings - Get all settings (Admin only)
router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const settings = await prisma.appConfig.findMany();
    
    // Convert array to object
    const settingsObj = settings.reduce((acc: any, { key, value }: any) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings - Update settings (Admin only)
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validated = settingsSchema.parse(req.body);
    
    // Update or create each setting
    const updates = Object.entries(validated).map(([key, value]) => {
      return prisma.appConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });
    
    await Promise.all(updates);
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.issues 
      });
    }
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// GET /api/settings/:key - Get specific setting (Admin only)
router.get('/:key', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.appConfig.findUnique({
      where: { key },
    });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

export { router as settingsRouter };
