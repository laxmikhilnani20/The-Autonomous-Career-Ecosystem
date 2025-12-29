import { query } from '../db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
