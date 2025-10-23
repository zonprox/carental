import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { validateRequest } from '../middleware/validation.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const usersRouter = Router();

const userQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 10),
});

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  isAdmin: z.boolean().optional().default(false),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  isAdmin: z.boolean().optional(),
});

// Get all users (admin only)
usersRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const query = userQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user statistics (admin only)
usersRouter.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totalUsers, adminUsers, regularUsers, verifiedUsers, pendingUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isAdmin: true } }),
      prisma.user.count({ where: { isAdmin: false } }),
      prisma.user.count({ where: { verificationStatus: 'verified' } }),
      prisma.user.count({ where: { verificationStatus: 'pending' } }),
    ]);

    res.json({
      totalUsers,
      adminUsers,
      regularUsers,
      verifiedUsers,
      pendingUsers,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Get users pending verification (admin only)
usersRouter.get('/pending-verification', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { verificationStatus: 'pending' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        idCardUrl: true,
        driverLicenseUrl: true,
        verificationStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
});

// Get current user profile
usersRouter.get('/profile/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        idCardUrl: true,
        driverLicenseUrl: true,
        verificationStatus: true,
        verificationNotes: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Upload documents
usersRouter.post(
  '/profile/documents',
  requireAuth,
  upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'driverLicense', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const updateData: {
        idCardUrl?: string;
        driverLicenseUrl?: string;
        verificationStatus: string;
      } = {
        verificationStatus: 'pending',
      };

      if (files.idCard) {
        updateData.idCardUrl = `/uploads/${files.idCard[0].filename}`;
      }

      if (files.driverLicense) {
        updateData.driverLicenseUrl = `/uploads/${files.driverLicense[0].filename}`;
      }

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          idCardUrl: true,
          driverLicenseUrl: true,
          verificationStatus: true,
        },
      });

      res.json({ user, message: 'Documents uploaded successfully' });
    } catch (error) {
      console.error('Error uploading documents:', error);
      res.status(500).json({ error: 'Failed to upload documents' });
    }
  }
);

// Update user verification status (admin only)
const verificationSchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected']),
  note: z.string().optional(),
});

usersRouter.patch(
  '/:id/verification',
  requireAuth,
  requireAdmin,
  validateRequest(verificationSchema),
  async (req, res) => {
    try {
      const { status, note } = req.body as z.infer<typeof verificationSchema>;

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          verificationStatus: status,
          verificationNotes: note,
        },
        select: {
          id: true,
          email: true,
          name: true,
          verificationStatus: true,
          verificationNotes: true,
        },
      });

      res.json({ user });
    } catch (error) {
      console.error('Error updating verification:', error);
      res.status(500).json({ error: 'Failed to update verification status' });
    }
  }
);

// Get single user (admin only)
usersRouter.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user (admin only)
usersRouter.post('/', requireAuth, requireAdmin, validateRequest(createUserSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof createUserSchema>;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (admin only)
usersRouter.put('/:id', requireAuth, requireAdmin, validateRequest(updateUserSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof updateUserSchema>;

    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
usersRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user?.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
