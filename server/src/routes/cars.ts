import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { validateRequest } from '../middleware/validation.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const carsRouter = Router();

const carSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  type: z.string().min(1),
  dailyPrice: z.number().positive(),
  priceWithDriver: z.number().nonnegative().optional().default(0),
  featured: z.boolean().optional().default(false),
});

const carQuerySchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(() => 10),
});

carsRouter.get('/', async (req, res) => {
  try {
    const query = carQuerySchema.parse(req.query);
    const skip = (query.page - 1) * query.limit;
    
    const where: Prisma.CarWhereInput = {};
    
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    
    if (query.type) {
      where.type = query.type;
    }
    
    let orderBy: Prisma.CarOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy === 'price_asc') orderBy = { dailyPrice: 'asc' };
    if (query.sortBy === 'price_desc') orderBy = { dailyPrice: 'desc' };
    if (query.sortBy === 'name_asc') orderBy = { name: 'asc' };
    if (query.sortBy === 'name_desc') orderBy = { name: 'desc' };
    
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
      }),
      prisma.car.count({ where }),
    ]);
    
    res.json({
      cars,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

carsRouter.get('/:id', async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
    });
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.json({ car });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

carsRouter.post('/', requireAuth, requireAdmin, validateRequest(carSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof carSchema>;
    const car = await prisma.car.create({ data });
    res.status(201).json({ car });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
});

carsRouter.put('/:id', requireAuth, requireAdmin, validateRequest(carSchema), async (req, res) => {
  try {
    const data = req.body as z.infer<typeof carSchema>;
    const car = await prisma.car.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
});

carsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.car.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});
