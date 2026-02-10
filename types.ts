
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isDeleted: boolean;
  color: string;
  updatedAt: number;
  createdAt: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  icon: string;
  description: string;
}

export interface UserStats {
  bookTitle: string;
  avatar: string; // Keeping for compatibility but will use first letter in UI
  level: number;
  xp: number;
  skillPoints: number;
  skills: Record<string, number>;
  // Achievement tracking
  notesCreatedCount: number;
  notesUpdatedCount: number;
  notesDeletedCount: number;
  totalGlyphsCount: number; // Historical peak or current sum
  totalWordsCount: number;   // Historical peak or current sum
  unlockedAchievements: string[];
  achievementPoints: number;
}

export enum ContextMenuType {
  GENERAL = 'GENERAL',
  NOTE = 'NOTE',
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  color?: string;
}

export interface AchievementThresholds {
  notesCreated: number[];
  notesUpdated: number[];
  notesDeleted: number[];
  levels: number[];
  glyphs: number[];
  words: number[];
}
