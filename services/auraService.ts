import { GoogleGenAI, Type } from "@google/genai";
import { Insight } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Gemini API Key not configured. AI features will return mock data.");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-ui-demo' });
};

// Helper: Add timeout to Promise
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<T>((_, reject) => 
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

// NEW: specific function for the 2-step onboarding
export const generateInitialRoadmap = async (fileName: string, targetRole: string): Promise<Insight[]> => {
  const ai = getClient();
  const prompt = `
    Context: User is onboarding to AURA.
    Resume File: "${fileName}"
    Target Goal: "${targetRole}"

    Task: Generate 3 distinct "Gap" insights that serve as a checklist for the user to reach the Target Goal based on the Resume.
    
    1. A technical skill gap (GAP).
    2. A strategic/soft skill gap (GAP).
    3. A certification or proof-of-work gap (GAP).

    JSON Schema for the Array:
    [{
      "title": "Short title",
      "description": "Why this is missing for ${targetRole}.",
      "missionTitle": "Protocol: [Task Name]",
      "missionBrief": "A detailed, step-by-step instruction on exactly what the user needs to study, build, or do to close this gap. Be specific.",
      "actionContent": "A professional LinkedIn post draft announcing completion of this task."
    }]
  `;

  try {
    console.log('🤖 Calling Gemini API...');
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                missionTitle: { type: Type.STRING },
                missionBrief: { type: Type.STRING },
                actionContent: { type: Type.STRING }
              }
            }
          }
        }
      }),
      30000 // 30 second timeout
    );
    
    console.log('✅ Gemini response received');
    const text = response.text;
    if (!text) {
      console.warn('⚠️ Empty response from Gemini');
      throw new Error('Empty response from AI');
    }'❌ Gemini API Error:', e);
    alert(`AI processing failed: ${e instanceof Error ? e.message : 'Unknown error'}. Using fallback data.`
    const data = JSON.parse(text);

    return data.map((item: any) => ({
      id: crypto.randomUUID(),
      type: 'gap',
      title: item.title,
      description: item.description,
      status: 'active',
      missionTitle: item.missionTitle,
      missionBrief: item.missionBrief,
      actionContent: item.actionContent,
      timestamp: new Date()
    }));

  } catch (e) {
    console.error(e);
    // Fallback if AI fails
    return [
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Skill Gap: Modern Frameworks',
        description: `Your resume lacks explicit mention of modern tools required for ${targetRole}.`,
        status: 'active',
        missionTitle: 'Protocol: Portfolio Update',
        missionBrief: 'Step 1: Initialize a Next.js project. Step 2: Build a landing page demonstrating server-side rendering. Step 3: Deploy to Vercel.',
        actionContent: `Excited to share my latest project targeting ${targetRole} skills! Check out the repo. #Coding`,
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Certification Audit',
        description: `To reach ${targetRole}, a cloud certification is highly recommended.`,
        status: 'active',
        missionTitle: 'Protocol: AWS/GCP Foundations',
        missionBrief: '1. Complete the Cloud Practitioner Essentials course. 2. Take one practice exam. 3. Score at least 80%.',
        actionContent: 'Just passed a mock exam for Cloud Foundations. One step closer to certification!',
        timestamp: new Date()
      }
    ];
  }
};

// Existing analysis function - simplified for brevity of diff, but logic remains similar
export const analyzeUploadAndGenerateInsight = async (
  uploadType: 'resume' | 'achievement', 
  fileName: string
): Promise<Insight> => {
  const ai = getClient();
  
  const prompt = `
    User uploaded "${fileName}" to "${uploadType}".
    Geneole.log('🤖 Analyzing upload:', fileName);
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                missionTitle: { type: Type.STRING, nullable: true },
                missionBrief: { type: Type.STRING, nullable: true },
                actionContent: { type: Type.STRING }
              }
          }
        }
      }),
      30000 // 30 second timeout
    );

    console.log('✅ Analysis complete');      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING },
              missionTitle: { type: Type.STRING, nullable: true },
              missionBrief: { type: Type.STRING, nullable: true },
              actionContent: { type: Type.STRING }
            }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: crypto.randomUUID(),
      type: data.type,
      title: data.title,
      description: data.description,
      status: 'active',
    console.error('❌ Upload analysis failed:', error);
    alert(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Using placeholder.`);
      missionTitle: data.missionTitle,
      missionBrief: data.missionBrief,
      actionContent: data.actionContent,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      id: crypto.randomUUID(),
      type: uploadType === 'resume' ? 'gap' : 'success',
      title: 'Analysis Complete',
      description: 'Data integrated.',
      status: 'active',
      timestamp: new Date()
    };
  }
};

export const generateActionPlan = async (goal: string): Promise<Insight> => {
    // Keep existing logic or update if needed
    return {
      id: crypto.randomUUID(),
      type: 'actionable',
      title: 'North Star Updated',
      description: `Re-aligning path to ${goal}.`,
      status: 'active',
      timestamp: new Date()
    };
};
