import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await query(
      'SELECT id, username, has_onboarded, growth_level, readiness, target_role FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        username: user.username,
        hasOnboarded: user.has_onboarded,
        growthLevel: user.growth_level,
        readiness: user.readiness,
        targetRole: user.target_role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if user exists
    const existing = await query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Create user
    const result = await query(
      'INSERT INTO users (username, password, has_onboarded, growth_level, readiness) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, has_onboarded, growth_level, readiness, target_role',
      [username, password, false, 25, 35]
    );

    const user = result.rows[0];
    res.status(201).json({
      user: {
        username: user.username,
        hasOnboarded: user.has_onboarded,
        growthLevel: user.growth_level,
        readiness: user.readiness,
        targetRole: user.target_role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user progress
router.put('/progress', async (req, res) => {
  try {
    const { username, growthLevel, readiness, hasOnboarded, targetRole } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const result = await query(
      'UPDATE users SET growth_level = $1, readiness = $2, has_onboarded = $3, target_role = $4 WHERE username = $5 RETURNING *',
      [growthLevel, readiness, hasOnboarded, targetRole, username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
