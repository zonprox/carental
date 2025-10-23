import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { validateRequest } from '../middleware/validation.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const bookingsRouter = Router();

const bookingSchema = z.object({
  carId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  withDriver: z.boolean().optional().default(false),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  notes: z.string().optional(),
});

const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 10),
});

// Get all bookings (admin only)
bookingsRouter.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const query = bookingQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;

    const where: Prisma.BookingWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.booking.count({ where }),
    ]);

    // Transform bookings to include carName
    const transformedBookings = bookings.map((booking: any) => ({
      ...booking,
      carName: booking.car.name,
    }));

    res.json({
      bookings: transformedBookings,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking statistics (admin only)
bookingsRouter.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.aggregate({
        where: { status: { in: ['confirmed', 'completed'] } },
        _sum: { totalPrice: true },
      }),
    ]);

    // Get revenue by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.booking.groupBy({
      by: ['createdAt'],
      where: {
        status: { in: ['confirmed', 'completed'] },
        createdAt: { gte: sixMonthsAgo },
      },
      _sum: { totalPrice: true },
    });

    // Group by month
    const revenueByMonth: Record<string, number> = {};
    monthlyRevenue.forEach((item: any) => {
      const month = new Date(item.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
      });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + (item._sum.totalPrice || 0);
    });

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      revenueByMonth,
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
});

// Get single booking (admin or booking owner)
bookingsRouter.get('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        car: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is admin or booking owner
    if (!req.user?.isAdmin && booking.userId !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking
bookingsRouter.post('/', requireAuth, validateRequest(bookingSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof bookingSchema>;

    // Fetch car to calculate price
    const car = await prisma.car.findUnique({
      where: { id: data.carId },
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Calculate total price
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const basePrice = car.dailyPrice * days;
    const driverPrice = (data.withDriver && car.priceWithDriver) ? car.priceWithDriver * days : 0;
    const totalPrice = basePrice + driverPrice;
    const depositAmount = totalPrice * 0.3; // 30% deposit

    const booking = await prisma.booking.create({
      data: {
        ...data,
        userId: req.user!.userId,
        basePrice,
        driverPrice,
        totalPrice,
        depositAmount,
        paidAmount: 0,
      },
      include: {
        car: true,
      },
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status (admin only)
const statusUpdateSchema = z.object({
  status: z.enum([
    'pending',
    'verified',
    'confirmed',
    'delivered',
    'active',
    'returning',
    'completed',
    'cancelled',
  ]),
  notes: z.string().optional(),
});

bookingsRouter.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validateRequest(statusUpdateSchema),
  async (req, res) => {
    try {
      const { status, notes } = req.body as z.infer<typeof statusUpdateSchema>;

      // Prepare update data with timestamp fields based on status
      const updateData: {
        status: string;
        verifiedAt?: Date;
        confirmedAt?: Date;
        deliveredAt?: Date;
        deliveryDate?: Date;
        deliveryNotes?: string;
        completedAt?: Date;
        actualReturnDate?: Date;
        returnNotes?: string;
      } = { status };

      // Set appropriate timestamp based on status
      const now = new Date();
      if (status === 'verified') {
        updateData.verifiedAt = now;
      } else if (status === 'confirmed') {
        updateData.confirmedAt = now;
      } else if (status === 'delivered') {
        updateData.deliveredAt = now;
        updateData.deliveryDate = now;
        if (notes) updateData.deliveryNotes = notes;
      } else if (status === 'completed') {
        updateData.completedAt = now;
        updateData.actualReturnDate = now;
        if (notes) updateData.returnNotes = notes;
      }

      const booking = await prisma.booking.update({
        where: { id: req.params.id },
        data: updateData,
        include: {
          car: true,
        },
      });

      res.json({ booking });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Failed to update booking status' });
    }
  }
);

// Update booking charges (admin only)
const chargesSchema = z.object({
  cleaningFee: z.number().nonnegative().optional(),
  damageFee: z.number().nonnegative().optional(),
  overtimeFee: z.number().nonnegative().optional(),
  fuelFee: z.number().nonnegative().optional(),
  otherFees: z.number().nonnegative().optional(),
  feesNotes: z.string().optional(),
});

bookingsRouter.patch(
  '/:id/charges',
  requireAuth,
  requireAdmin,
  validateRequest(chargesSchema),
  async (req, res) => {
    try {
      const data = req.body as z.infer<typeof chargesSchema>;

      // Calculate new total price including charges
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const additionalCharges =
        (data.cleaningFee || 0) +
        (data.damageFee || 0) +
        (data.overtimeFee || 0) +
        (data.fuelFee || 0) +
        (data.otherFees || 0);

      const newTotalPrice = booking.basePrice + booking.driverPrice + additionalCharges;

      const updatedBooking = await prisma.booking.update({
        where: { id: req.params.id },
        data: {
          ...data,
          totalPrice: newTotalPrice,
        },
        include: {
          car: true,
        },
      });

      res.json({ booking: updatedBooking });
    } catch (error) {
      console.error('Error updating booking charges:', error);
      res.status(500).json({ error: 'Failed to update booking charges' });
    }
  }
);

// Update booking payment (admin only)
const paymentSchema = z.object({
  paidAmount: z.number().nonnegative(),
  paymentNotes: z.string().optional(),
});

bookingsRouter.patch(
  '/:id/payment',
  requireAuth,
  requireAdmin,
  validateRequest(paymentSchema),
  async (req, res) => {
    try {
      const { paidAmount, paymentNotes } = req.body as z.infer<typeof paymentSchema>;

      const booking = await prisma.booking.update({
        where: { id: req.params.id },
        data: {
          paidAmount,
          ...(paymentNotes && { notes: paymentNotes }),
        },
        include: {
          car: true,
        },
      });

      res.json({ booking });
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  }
);

// Delete booking (admin only)
bookingsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});
