import { User, Insight } from '../types';

const DB_KEY = 'aura_db_v1';
const SESSION_KEY = 'aura_session';

interface UserSchema extends User {
  password: string; // In a real app, this would be hashed
  insights: Insight[]; // Persistence for the feed
}

interface Database {
  users: Record<string, UserSchema>;
}

const getDB = (): Database => {
  const dbStr = localStorage.getItem(DB_KEY);
  return dbStr ? JSON.parse(dbStr) : { users: {} };
};

const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const authService = {
  login: (username: string, password: string): User | null => {
    const db = getDB();
    const user = db.users[username];
    
    if (user && user.password === password) {
      localStorage.setItem(SESSION_KEY, username);
      // Return user without password/insights (insights fetched separately)
      const { password: _, insights: __, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },

  signup: (username: string, password: string): User | null => {
    const db = getDB();
    if (db.users[username]) {
      return null; // User exists
    }

    const newUser: UserSchema = {
      username,
      password,
      hasOnboarded: false,
      growthLevel: 25,
      readiness: 35,
      insights: []
    };

    db.users[username] = newUser;
    saveDB(db);
    localStorage.setItem(SESSION_KEY, username);

    const { password: _, insights: __, ...safeUser } = newUser;
    return safeUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return null;

    const db = getDB();
    const user = db.users[username];
    if (!user) return null;

    const { password: _, insights: __, ...safeUser } = user;
    return safeUser;
  },

  getUserInsights: (): Insight[] => {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return [];

    const db = getDB();
    return db.users[username]?.insights || [];
  },

  updateProgress: (growthLevel: number, readiness: number, hasOnboarded: boolean = true, targetRole?: string) => {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return;

    const db = getDB();
    if (db.users[username]) {
      db.users[username].growthLevel = growthLevel;
      db.users[username].readiness = readiness;
      db.users[username].hasOnboarded = hasOnboarded;
      if (targetRole) {
        db.users[username].targetRole = targetRole;
      }
      saveDB(db);
    }
  },

  saveInsights: (insights: Insight[]) => {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return;

    const db = getDB();
    if (db.users[username]) {
      db.users[username].insights = insights;
      saveDB(db);
    }
  }
};
