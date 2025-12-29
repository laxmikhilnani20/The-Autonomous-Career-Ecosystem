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

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
