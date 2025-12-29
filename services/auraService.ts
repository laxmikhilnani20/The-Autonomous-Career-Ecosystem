import { Insight, InsightType } from "../types";

// Helper to call backend
const apiCall = async (endpoint: string, body: any) => {
  try {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const generateInitialRoadmap = async (fileName: string, targetRole: string): Promise<Insight[]> => {
  // Call backend to generate roadmap based on goal and resume (simulated text)
  const result = await apiCall('/milestone', { 
    targetRole, 
    userId: 'user-123' // In real app, get from auth
  });

  if (result && result.plan) {
    try {
      // The backend returns a JSON string in 'plan'
      const cleanJson = result.plan.replace(/```json|```/g, '').trim();
      const planData = JSON.parse(cleanJson);
      
      return planData.map((item: any) => ({
        id: crypto.randomUUID(),
        type: 'gap',
        title: item.title || "Strategic Gap",
        description: item.description || item.step || "Action required to reach goal.",
        status: 'active',
        missionTitle: item.missionTitle || "Protocol: Skill Acquisition",
        missionBrief: item.missionBrief || "Complete the recommended training module.",
        actionContent: item.actionContent || "Just completed a key milestone!",
        timestamp: new Date()
      }));
    } catch (e) {
      console.error("Failed to parse plan", e);
    }
  }

  // Fallback
  return [
    {
      id: crypto.randomUUID(),
      type: 'gap',
      title: 'Skill Gap: Cloud Architecture',
      description: `Your profile needs more evidence of cloud skills for ${targetRole}.`,
      status: 'active',
      missionTitle: 'Protocol: AWS Certification',
      missionBrief: '1. Study VPC and EC2. 2. Deploy a sample app. 3. Pass the practice exam.',
      actionContent: `Working towards my ${targetRole} goal by mastering Cloud Architecture. #Growth`,
      timestamp: new Date()
    }
  ];
};

export const analyzeUploadAndGenerateInsight = async (
  uploadType: 'resume' | 'achievement', 
  fileName: string
): Promise<Insight> => {
  
  // Simulate text content from file (in real app, use Document AI on backend)
  const simulatedText = `File: ${fileName}. Type: ${uploadType}. This document contains professional history and skills.`;

  const result = await apiCall('/analyze', {
    text: simulatedText,
    type: uploadType,
    userId: 'user-123'
  });

  if (result && result.insight) {
    try {
      const cleanJson = result.insight.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      return {
        id: crypto.randomUUID(),
        type: data.type === 'success' ? 'success' : 'gap',
        title: data.title,
        description: data.description,
        status: 'active',
        missionTitle: data.missionTitle, 
        missionBrief: data.missionBrief,
        actionContent: "I just updated my professional profile with new insights!",
        timestamp: new Date()
      };
    } catch (e) {
      console.error("Failed to parse insight", e);
    }
  }

  return {
    id: crypto.randomUUID(),
    type: uploadType === 'resume' ? 'gap' : 'success',
    title: 'Analysis Complete',
    description: 'Your document has been processed and added to the vector store.',
    status: 'active',
    timestamp: new Date()
  };
};

export const generateActionPlan = async (goal: string): Promise<Insight> => {
    // Re-use milestone endpoint for goal setting
    const result = await apiCall('/milestone', { targetRole: goal, userId: 'user-123' });
    
    return {
      id: crypto.randomUUID(),
      type: 'actionable',
      title: 'North Star Updated',
      description: `Readiness Score: ${result?.readiness || 0}%. Analysis complete.`,
      status: 'active',
      timestamp: new Date()
    };
};
