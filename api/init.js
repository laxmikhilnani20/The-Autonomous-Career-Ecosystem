import { query } from './db.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Enable UUID extension
    await query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Drop existing tables to ensure clean state and fix constraint issues
    await query('DROP TABLE IF EXISTS insights');
    await query('DROP TABLE IF EXISTS users');

    // Create Users Table
    await query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          has_onboarded BOOLEAN DEFAULT FALSE,
          growth_level INTEGER DEFAULT 25,
          readiness INTEGER DEFAULT 35,
          target_role TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Insights Table
    await query(`
      CREATE TABLE insights (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL CHECK (type IN ('success', 'actionable', 'gap')),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'shared')),
          mission_title TEXT,
          mission_brief TEXT,
          action_content TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
      CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(type);
      CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
      CREATE INDEX IF NOT EXISTS idx_insights_timestamp ON insights(timestamp DESC);
    `);

    // Function to update updated_at timestamp
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Trigger
    await query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    
    res.json({ 
      success: true, 
      message: 'Database schema initialized successfully' 
    });
  } catch (error) {
    console.error('Init DB error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
