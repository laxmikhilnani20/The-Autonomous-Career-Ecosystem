import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get user insights
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Get user ID
    const userResult = await query('SELECT id FROM users WHERE username = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Get insights
    const result = await query(
      'SELECT id, type, title, description, status, mission_title, mission_brief, action_content, timestamp FROM insights WHERE user_id = $1 ORDER BY timestamp DESC',
      [userId]
    );

    const insights = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      status: row.status,
      missionTitle: row.mission_title,
      missionBrief: row.mission_brief,
      actionContent: row.action_content,
      timestamp: row.timestamp
    }));

    res.json({ insights });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create insight
router.post('/', async (req, res) => {
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
});

// Update insight status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const result = await query(
      'UPDATE insights SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Insight not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update insight status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save multiple insights (for onboarding/bulk operations)
router.post('/bulk', async (req, res) => {
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

    // Insert all insights
    const insertedInsights = [];
    for (const insight of insights) {
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
});

export default router;
