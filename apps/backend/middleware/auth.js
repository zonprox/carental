import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // Ensure JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    
    const decoded = jwt.verify(token, jwtSecret);
    
    // Verify user still exists
    const user = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [decoded.userId]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin role required.',
      userRole: req.user.role 
    });
  }
  
  next();
};

export { authenticateToken, requireAdmin };