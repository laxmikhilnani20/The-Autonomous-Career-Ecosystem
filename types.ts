export type InsightType = 'success' | 'actionable' | 'gap';
export type InsightStatus = 'active' | 'completed' | 'shared';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  status: InsightStatus; 
  
  // Gamification fields
  missionTitle?: string; 
  missionBrief?: string; 
  
  actionContent?: string; 
  timestamp: Date;
}

export interface GardenState {
  growthLevel: number; // 0 to 100
  blooms: number; // Number of active blooms
  lastWatered: Date | null;
}

export enum UploadType {
  RESUME = 'resume',
  ACHIEVEMENT = 'achievement'
}

export interface DragState {
  isDragging: boolean;
  type: UploadType | null;
}

export interface User {
  username: string;
  hasOnboarded: boolean;
  growthLevel: number;
  readiness: number;
  targetRole?: string; // New: The North Star
}
