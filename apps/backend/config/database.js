import mockDatabase from '../services/mockDatabase.js';
import dotenv from 'dotenv';

dotenv.config();

// Use mock database instead of PostgreSQL
const pool = mockDatabase;

// Simulate connection events
console.log('Connected to Mock Database (JSON-based)');

export default pool;