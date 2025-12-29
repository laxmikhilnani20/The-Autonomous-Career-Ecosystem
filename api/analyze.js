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
    const { text, type, userId } = req.body;
    
    // A. Generate Embedding
    const vector = await getEmbedding(text);
    
    // B. Store in Aiven
    const query = `
      INSERT INTO career_nodes (user_id, content, metadata, embedding)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const metadata = { type, timestamp: new Date().toISOString() };
    await pool.query(query, [userId || 'demo-user', text, metadata, JSON.stringify(vector)]);

    // C. Generate Insight
    const prompt = `
      Analyze this career update (${type}):
      "${text}"
      
      Return a JSON object with:
      - title: A short punchy title
      - description: A 1-sentence summary of the impact
      - type: 'success' (if achievement) or 'gap' (if resume gap found)
      - readiness_boost: number (0-10)
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insight = response.text();

    res.status(200).json({ success: true, insight });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: error.message });
  }
}
