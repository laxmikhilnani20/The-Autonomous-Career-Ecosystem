import { query } from '../db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Get user ID
    const userResult = await query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Remove duplicate insights - keep only the newest of each title
    const result = await query(`
      DELETE FROM insights 
      WHERE id IN (
        SELECT id 
        FROM (
          SELECT id, 
                 ROW_NUMBER() OVER (PARTITION BY title, type ORDER BY timestamp DESC) AS rn
          FROM insights 
          WHERE user_id = $1
        ) t
        WHERE t.rn > 1
      )
      RETURNING id
    `, [userId]);

    const deletedCount = result.rows.length;

    res.status(200).json({ 
      message: `Cleaned up ${deletedCount} duplicate insights`,
      deletedCount
    });
  } catch (error) {
    console.error('Cleanup insights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
