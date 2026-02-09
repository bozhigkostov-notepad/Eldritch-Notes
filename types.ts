
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isDeleted: boolean; // Added to track if note is in the Catacombs
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
  name: string;
  avatar: string;
  level: number;
  xp: number;
  skillPoints: number;
  skills: Record<string, number>;
  streak: number;
  lastActiveDate: string;
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
