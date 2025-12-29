import { User, Insight } from '../types';

const API_URL = '/api';

// Store current user in memory for session
let currentUsername: string | null = null;

export const authService = {
  login: async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      currentUsername = username;
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  signup: async (username: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      currentUsername = username;
      return data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  },

  logout: () => {
    currentUsername = null;
  },

  getCurrentUser: (): User | null => {
    // In a real app, you'd check session/JWT token
    // For now, we rely on the in-memory username
    return currentUsername ? { username: currentUsername } as User : null;
  },

  getUserInsights: async (): Promise<Insight[]> => {
    if (!currentUsername) return [];

    try {
      const response = await fetch(`${API_URL}/insights/${currentUsername}`);
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.insights.map((insight: any) => ({
        ...insight,
        timestamp: new Date(insight.timestamp)
      }));
    } catch (error) {
      console.error('Get insights error:', error);
      return [];
    }
  },

  updateProgress: async (
    growthLevel: number,
    readiness: number,
    hasOnboarded: boolean = true,
    targetRole?: string
  ): Promise<void> => {
    if (!currentUsername) return;

    try {
      await fetch(`${API_URL}/auth/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUsername,
          growthLevel,
          readiness,
          hasOnboarded,
          targetRole
        })
      });
    } catch (error) {
      console.error('Update progress error:', error);
    }
  },

  saveInsight: async (insight: Insight): Promise<void> => {
    if (!currentUsername) return;

    try {
      await fetch(`${API_URL}/insights/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUsername,
          insight: {
            type: insight.type,
            title: insight.title,
            description: insight.description,
            status: insight.status,
            missionTitle: insight.missionTitle,
            missionBrief: insight.missionBrief,
            actionContent: insight.actionContent,
            timestamp: insight.timestamp
          }
        })
      });
    } catch (error) {
      console.error('Save insight error:', error);
    }
  },

  saveInsights: async (insights: Insight[]): Promise<void> => {
    if (!currentUsername) return;

    try {
      await fetch(`${API_URL}/insights/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUsername,
          insights: insights.map(insight => ({
            type: insight.type,
            title: insight.title,
            description: insight.description,
            status: insight.status,
            missionTitle: insight.missionTitle,
            missionBrief: insight.missionBrief,
            actionContent: insight.actionContent,
            timestamp: insight.timestamp
          }))
        })
      });
    } catch (error) {
      console.error('Save insights error:', error);
    }
  },

  updateInsightStatus: async (id: string, status: string): Promise<void> => {
    try {
      await fetch(`${API_URL}/insights/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (error) {
      console.error('Update insight status error:', error);
    }
  }
};

