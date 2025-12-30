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

// NEW: Analyze resume and determine initial metrics
export const analyzeResumeMetrics = async (fileName: string, targetRole: string): Promise<{
  growthLevel: number;
  readiness: number;
  phase: 'seedling' | 'blooming' | 'mature';
}> => {
  const ai = getClient();
  const prompt = `
    Analyze this career profile:
    Resume File: "${fileName}"
    Target Role: "${targetRole}"
    
    Based on the filename and target role, assess:
    1. Growth Level (0-100): How developed is their career? 
       - 0-30: Early career/student
       - 31-60: Mid-level professional
       - 61-100: Senior/expert level
    
    2. Career Readiness (0-100): How ready are they for the target role?
       - 0-30: Many gaps to fill
       - 31-60: Some experience, needs growth
       - 61-100: Nearly ready or overqualified
    
    3. Phase: 
       - "seedling": Early career, just starting
       - "blooming": Actively developing skills
       - "mature": Experienced professional
    
    JSON Schema:
    {
      "growthLevel": 45,
      "readiness": 60,
      "phase": "blooming"
    }
  `;

  try {
    console.log('🔍 Analyzing resume metrics...');
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              growthLevel: { type: Type.NUMBER },
              readiness: { type: Type.NUMBER },
              phase: { type: Type.STRING }
            }
          }
        }
      }),
      30000
    );
    
    const data = JSON.parse(response.text || '{}');
    console.log('✅ Metrics analyzed:', data);
    return {
      growthLevel: Math.min(100, Math.max(0, data.growthLevel || 30)),
      readiness: Math.min(100, Math.max(0, data.readiness || 45)),
      phase: data.phase || 'blooming'
    };
  } catch (error) {
    console.error('❌ Metrics analysis failed:', error);
    // Fallback to conservative defaults
    return {
      growthLevel: 30,
      readiness: 45,
      phase: 'blooming'
    };
  }
};

// NEW: specific function for the 2-step onboarding
export const generateInitialRoadmap = async (fileName: string, targetRole: string): Promise<Insight[]> => {
  const ai = getClient();
  const prompt = `
    Context: User is onboarding to AURA with career goal: "${targetRole}".
    Resume File: "${fileName}"

    Task: Generate a COMPLETE STRATEGIC ROADMAP with 5-7 detailed action items (gaps) that the user must complete to reach their target role.
    
    Cover these categories (generate 1-2 items per category):
    1. Technical Skills - Specific technologies, frameworks, or tools they need to learn
    2. Soft Skills/Leadership - Communication, management, or strategic thinking gaps
    3. Projects/Portfolio - Hands-on work they should build to demonstrate expertise
    4. Certifications/Education - Professional credentials or courses needed
    5. Networking/Visibility - LinkedIn presence, community involvement, or personal brand building
    
    Requirements:
    - Each item should be ACTIONABLE and SPECIFIC
    - Mission Brief must include step-by-step instructions (numbered list)
    - Make it comprehensive so completing ALL items = 100% readiness for the role
    - Arrange items in logical order (foundational skills first, advanced last)

    JSON Schema for the Array (5-7 items):
    [{
      "title": "Concise, actionable title",
      "description": "Why this specific gap is blocking them from ${targetRole}. Be specific about the impact.",
      "missionTitle": "Protocol: [Specific Task Name]",
      "missionBrief": "Detailed step-by-step action plan:\n1. First concrete step\n2. Second step with specific resource or tool\n3. Measurable outcome or deliverable\n(Include 3-5 steps per mission)",
      "actionContent": "Professional LinkedIn post draft that showcases completion of this milestone (include relevant hashtags)"
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
    }
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
    console.error('❌ Gemini API Error:', e);
    alert(`AI processing failed: ${e instanceof Error ? e.message : 'Unknown error'}. Using fallback data.`);
    // Fallback with 5 comprehensive items
    return [
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Master Core Framework',
        description: `${targetRole} requires deep expertise in modern frameworks that aren't evident in your current resume.`,
        status: 'active',
        missionTitle: 'Protocol: Framework Mastery',
        missionBrief: '1. Complete official React/Next.js documentation\n2. Build 3 progressively complex projects\n3. Deploy all projects with proper CI/CD\n4. Document learnings in blog posts',
        actionContent: `Just completed my deep dive into modern web frameworks! Built and deployed 3 production-ready projects. Excited to bring these skills to my next role as ${targetRole}. #WebDev #React #NextJS`,
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Build Public Portfolio',
        description: `${targetRole} positions require demonstrable work. Your GitHub/portfolio needs enhancement.`,
        status: 'active',
        missionTitle: 'Protocol: Portfolio Excellence',
        missionBrief: '1. Create professional portfolio website\n2. Showcase 5 best projects with case studies\n3. Include technical blog (3+ posts)\n4. Optimize for SEO and mobile',
        actionContent: `Excited to launch my new portfolio website! Featuring deep dives into my recent projects and technical learnings. Check it out! 🚀 #DevPortfolio #TechBlog`,
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Earn Industry Certification',
        description: `Professional certification validates your expertise and is often required for ${targetRole}.`,
        status: 'active',
        missionTitle: 'Protocol: Professional Certification',
        missionBrief: '1. Research relevant certifications (AWS/Azure/GCP)\n2. Complete official training course\n3. Take 3 practice exams (score 85%+)\n4. Pass certification exam',
        actionContent: `Proud to announce I\'ve earned my [Certification Name]! This validates my cloud architecture skills and readiness for ${targetRole}. 🎓 #CloudComputing #Certification`,
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Develop Leadership Skills',
        description: `${targetRole} requires proven leadership and communication abilities beyond technical skills.`,
        status: 'active',
        missionTitle: 'Protocol: Leadership Development',
        missionBrief: '1. Lead a team project or open-source initiative\n2. Present technical topics in 2+ team meetings\n3. Mentor junior developers or students\n4. Document leadership learnings',
        actionContent: `Grateful for the opportunity to lead our latest project and mentor emerging developers. Leadership isn\'t just about code—it\'s about people. #TechLeadership #Mentorship`,
        timestamp: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'gap',
        title: 'Strengthen Online Presence',
        description: `${targetRole} professionals maintain strong visibility through content creation and community engagement.`,
        status: 'active',
        missionTitle: 'Protocol: Digital Presence',
        missionBrief: '1. Post technical content weekly on LinkedIn\n2. Contribute to 3 open-source projects\n3. Attend/speak at 2 tech events or meetups\n4. Build audience of 500+ engaged connections',
        actionContent: `Reflecting on my journey building my professional brand: 20+ technical posts, contributions to major OSS projects, and meaningful connections with amazing developers. Here\'s what I learned... #TechCommunity #OpenSource`,
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
    Generate a gamified Insight card.
    
    If 'resume': Identify a gap.
    If 'achievement': Identify a success.
    
    JSON Schema:
    {
      "title": "Title",
      "description": "Description",
      "type": "${uploadType === 'resume' ? 'gap' : 'success'}",
      "missionTitle": "Mission Name (nullable)",
      "missionBrief": "Specific instructions on what to do next (nullable)",
      "actionContent": "Draft post"
    }
  `;

  try {
    console.log('🤖 Analyzing upload:', fileName);
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

    console.log('✅ Analysis complete');
    const data = JSON.parse(response.text || '{}');
    return {
      id: crypto.randomUUID(),
      type: data.type,
      title: data.title,
      description: data.description,
      status: 'active',
      missionTitle: data.missionTitle,
      missionBrief: data.missionBrief,
      actionContent: data.actionContent,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('❌ Upload analysis failed:', error);
    alert(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Using placeholder.`);
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
