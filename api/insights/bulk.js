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
    const { username, insights } = req.body;

    if (!username || !insights || !Array.isArray(insights)) {
      return res.status(400).json({ error: 'Username and insights array required' });
    }

    // Get user ID
    const userResult = await query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // DELETE all existing insights for this user first to prevent duplicates
    await query('DELETE FROM insights WHERE user_id = $1', [userId]);

    // CRITICAL: Deduplicate insights by title+type on server side too
    const uniqueInsights = insights.reduce((acc, insight) => {
      const key = `${insight.title}|${insight.type}`;
      if (!acc.some(i => `${i.title}|${i.type}` === key)) {
        acc.push(insight);
      }
      return acc;
    }, []);

    console.log(`🧹 Server deduplication: ${insights.length} → ${uniqueInsights.length} unique insights`);

    // Insert all unique insights fresh
    const insertedInsights = [];
    for (const insight of uniqueInsights) {
      const result = await query(
        'INSERT INTO insights (user_id, type, title, description, status, mission_title, mission_brief, action_content, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [
          userId,
          insight.type,
          insight.title,
          insight.description,
          insight.status || 'active',
          insight.missionTitle || null,
          insight.missionBrief || null,
          insight.actionContent || null,
          insight.timestamp || new Date()
        ]
      );
      insertedInsights.push(result.rows[0]);
    }

    res.status(201).json({ 
      insights: insertedInsights.map(i => ({
        id: i.id,
        type: i.type,
        title: i.title,
        description: i.description,
        status: i.status,
        missionTitle: i.mission_title,
        missionBrief: i.mission_brief,
        actionContent: i.action_content,
        timestamp: i.timestamp
      }))
    });
  } catch (error) {
    console.error('Bulk create insights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
