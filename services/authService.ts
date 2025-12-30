import { User, Insight } from '../types';

const API_URL = '/api';

// Store current user in memory only - NO auto-login from localStorage
let currentUsername: string | null = null;
let currentUserData: User | null = null;

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
      currentUserData = data.user;
      
      // Persist to localStorage
      localStorage.setItem('aura_username', username);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      
      // Clean up any duplicate insights in background
      cleanupDuplicates(username).catch(console.error);
      
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
    // Clear insights cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('aura_insights_')) {
        localStorage.removeItem(key);
      }
    });
  },

  getCurrentUser: (): User | null => {
    return currentUserData;
  },

  getUserInsights: async (): Promise<Insight[]> => {
    if (!currentUsername) return [];

    // First, return cached data immediately for fast load
    const cacheKey = `aura_insights_${currentUsername}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedInsights = JSON.parse(cached).map((insight: any) => ({
          ...insight,
          timestamp: new Date(insight.timestamp)
        }));
        console.log('📦 Loaded cached insights:', cachedInsights.length);
        
        // Fetch fresh data in background (don't await)
        fetchFreshInsights(currentUsername, cacheKey).catch(console.error);
        
        return cachedInsights;
      } catch (e) {
        console.error('Cache parse error:', e);
      }
    }

    // No cache, fetch from API (with timeout)
    return fetchFreshInsights(currentUsername, cacheKey);
  },

  updateProgress: async (
    growthLevel: number,
    readiness: number,
    hasOnboarded: boolean = true,
    targetRole?: string
  ): Promise<void> => {
    if (!currentUsername) return;

    // Update in-memory user data
    if (currentUserData) {
      currentUserData = {
        ...currentUserData,
        growthLevel,
        readiness,
        hasOnboarded,
        targetRole: targetRole || currentUserData.targetRole
      };
      console.log('💾 Updated user data in memory:', currentUserData);
    }

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

    // CRITICAL: Deduplicate by title+type before saving
    const uniqueInsights = insights.reduce((acc, insight) => {
      const key = `${insight.title}|${insight.type}`;
      const existing = acc.find(i => `${i.title}|${i.type}` === key);
      
      // Keep the newest version if duplicate exists
      if (!existing) {
        acc.push(insight);
      } else {
        const existingTime = new Date(existing.timestamp).getTime();
        const currentTime = new Date(insight.timestamp).getTime();
        if (currentTime > existingTime) {
          // Replace with newer version
          const index = acc.indexOf(existing);
          acc[index] = insight;
        }
      }
      return acc;
    }, [] as Insight[]);

    console.log(`💾 Deduplicating: ${insights.length} → ${uniqueInsights.length} unique insights`);

    // Update cache immediately for instant access
    const cacheKey = `aura_insights_${currentUsername}`;
    localStorage.setItem(cacheKey, JSON.stringify(uniqueInsights));
    console.log('💾 Cached insights locally:', uniqueInsights.length);

    try {
      await fetch(`${API_URL}/insights/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUsername,
          insights: uniqueInsights.map(insight => ({
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
      console.log('✅ Insights saved to database (deduplicated)');
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

// Helper: Fetch from API with timeout
async function fetchFreshInsights(username: string, cacheKey: string): Promise<Insight[]> {
  try {
    console.log('🌐 Fetching fresh insights from API...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(`${API_URL}/insights/${username}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('API returned non-OK status:', response.status);
      return [];
    }

    const data = await response.json();
    const rawInsights = data.insights.map((insight: any) => ({
      ...insight,
      timestamp: new Date(insight.timestamp)
    }));
    
    // CRITICAL: Deduplicate insights by title+type (keep newest)
    const uniqueInsights = rawInsights.reduce((acc: Insight[], insight: Insight) => {
      const key = `${insight.title}|${insight.type}`;
      const existing = acc.find((i: Insight) => `${i.title}|${i.type}` === key);
      
      if (!existing) {
        acc.push(insight);
      } else {
        const existingTime = new Date(existing.timestamp).getTime();
        const currentTime = new Date(insight.timestamp).getTime();
        if (currentTime > existingTime) {
          // Replace with newer version
          const index = acc.indexOf(existing);
          acc[index] = insight;
        }
      }
      return acc;
    }, []);
    
    console.log(`🧹 Deduplication: ${rawInsights.length} → ${uniqueInsights.length} unique insights`);
    
    // Update cache with deduplicated data
    localStorage.setItem(cacheKey, JSON.stringify(uniqueInsights));
    console.log('✅ Fresh insights loaded:', uniqueInsights.length);
    
    return uniqueInsights;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ API timeout - database might not be initialized');
      alert('Loading insights timed out. Database might not be initialized. Visit /api/init');
    } else {
      console.error('❌ Error fetching insights:', error);
    }
    return [];
  }
};

async function cleanupDuplicates(username: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/insights/cleanup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('🧹 Cleaned up duplicates:', data.deletedCount);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}