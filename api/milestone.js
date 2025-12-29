import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from './db.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function getEmbedding(text) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetRole, userId } = req.body;
    
    // A. Embed the Goal
    const milestoneVector = await getEmbedding(targetRole);
    
    // B. Find Similarity in DB
    const vectorQuery = `
      SELECT content, 1 - (embedding <=> $1) as similarity
      FROM career_nodes
      WHERE user_id = $2
      ORDER BY similarity DESC
      LIMIT 5;
    `;
    
    const { rows } = await pool.query(vectorQuery, [JSON.stringify(milestoneVector), userId || 'demo-user']);
    
    const avgSimilarity = rows.length > 0 
      ? rows.reduce((acc, row) => acc + row.similarity, 0) / rows.length 
      : 0;
      
    const readinessScore = Math.round(avgSimilarity * 100);

    // C. Generate Action Plan
    const context = rows.map(r => r.content).join('\n');
    const prompt = `
      Target Role: ${targetRole}
      User's Current Top Matches:
      ${context}
      
      Based on this, generate 3 specific "Mission Protocols" to close the gap.
      Return JSON array.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.status(200).json({ 
      readiness: readinessScore, 
      matches: rows,
      plan: response.text() 
    });

  } catch (error) {
    console.error('Milestone analysis failed:', error);
    res.status(500).json({ error: error.message });
  }
}
