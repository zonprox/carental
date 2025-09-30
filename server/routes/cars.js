const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all cars (public route)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cars WHERE available = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single car by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new car (protected route)
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }).withMessage('Car name is required'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('seats').isInt({ min: 1, max: 50 }).withMessage('Valid number of seats is required'),
  body('fuel_type').trim().isLength({ min: 1 }).withMessage('Fuel type is required'),
  body('price_per_day').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('image_url').optional().isURL().withMessage('Valid image URL is required'),
  body('location').optional().trim()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: errors.array() 
      });
    }

    const { name, brand, year, seats, fuel_type, price_per_day, image_url, location } = req.body;

    const result = await pool.query(
      `INSERT INTO cars (name, brand, year, seats, fuel_type, price_per_day, image_url, location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, brand, year, seats, fuel_type, price_per_day, image_url || null, location || null]
    );

    res.status(201).json({
      message: 'Car created successfully',
      car: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update car (protected route)
router.put('/:id', authenticateToken, [
  body('name').trim().isLength({ min: 1 }).withMessage('Car name is required'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('seats').isInt({ min: 1, max: 50 }).withMessage('Valid number of seats is required'),
  body('fuel_type').trim().isLength({ min: 1 }).withMessage('Fuel type is required'),
  body('price_per_day').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('image_url').optional().isURL().withMessage('Valid image URL is required'),
  body('location').optional().trim()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { name, brand, year, seats, fuel_type, price_per_day, image_url, location } = req.body;

    // Check if car exists
    const existingCar = await pool.query('SELECT id FROM cars WHERE id = $1', [id]);
    if (existingCar.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const result = await pool.query(
      `UPDATE cars 
       SET name = $1, brand = $2, year = $3, seats = $4, fuel_type = $5, 
           price_per_day = $6, image_url = $7, location = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [name, brand, year, seats, fuel_type, price_per_day, image_url || null, location || null, id]
    );

    res.json({
      message: 'Car updated successfully',
      car: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete car (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if car exists
    const existingCar = await pool.query('SELECT id FROM cars WHERE id = $1', [id]);
    if (existingCar.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await pool.query('DELETE FROM cars WHERE id = $1', [id]);

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Toggle car availability (protected route)
router.patch('/:id/availability', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    // Check if car exists
    const existingCar = await pool.query('SELECT id, available FROM cars WHERE id = $1', [id]);
    if (existingCar.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const result = await pool.query(
      'UPDATE cars SET available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [available, id]
    );

    res.json({
      message: 'Car availability updated successfully',
      car: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating car availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;