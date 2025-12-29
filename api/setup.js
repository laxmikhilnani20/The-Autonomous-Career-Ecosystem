import pool from './db.js';

export default async function handler(req, res) {
  try {
    // 1. Enable Vector Extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector');

    // 2. Create Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS career_nodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        content TEXT,
        metadata JSONB,
        embedding VECTOR(768), 
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    res.status(200).json({ message: 'Database setup complete!' });
  } catch (err) {
    console.error('Error setting up database:', err);
    res.status(500).json({ error: err.message });
  }
}
