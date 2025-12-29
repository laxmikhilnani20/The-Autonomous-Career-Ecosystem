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
    const { username, insight } = req.body;

    if (!username || !insight) {
      return res.status(400).json({ error: 'Username and insight required' });
    }

    // Get user ID
    const userResult = await query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Insert insight
    const result = await query(
      'INSERT INTO insights (user_id, type, title, description, status, mission_title, mission_brief, action_content, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        userId,
        insight.type,
        insight.title,
        insight.description,
        insight.status,
        insight.missionTitle || null,
        insight.missionBrief || null,
        insight.actionContent || null,
        insight.timestamp || new Date()
      ]
    );

    const newInsight = result.rows[0];
    res.status(201).json({
      insight: {
        id: newInsight.id,
        type: newInsight.type,
        title: newInsight.title,
        description: newInsight.description,
        status: newInsight.status,
        missionTitle: newInsight.mission_title,
        missionBrief: newInsight.mission_brief,
        actionContent: newInsight.action_content,
        timestamp: newInsight.timestamp
      }
    });
  } catch (error) {
    console.error('Create insight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
