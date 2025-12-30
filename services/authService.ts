import { User, Insight } from '../types';

const API_URL = '/api';

// Store current user in memory AND localStorage for persistence
let currentUsername: string | null = localStorage.getItem('aura_username');
let currentUserData: User | null = null;

// Initialize user data from localStorage on module load
const storedUser = localStorage.getItem('aura_user');
if (storedUser) {
  try {
    currentUserData = JSON.parse(storedUser);
  } catch (e) {
    console.error('Failed to parse stored user data');
  }
}

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
      currentUserData = data.user;
      
      // Persist to localStorage
      localStorage.setItem('aura_username', username);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  },

  logout: () => {
    currentUsername = null;
    currentUserData = null;
    localStorage.removeItem('aura_username');
    localStorage.removeItem('aura_user');
  },

  getCurrentUser: (): User | null => {
    return currentUserData;
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

