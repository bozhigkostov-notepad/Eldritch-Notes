
import React from 'react';
import { Note, UserStats, AchievementThresholds } from './types';

export const XP_PER_LEVEL = 1000;
export const XP_PER_NOTE = 50;
export const XP_PER_TAG = 10;
export const XP_PER_CHAR = 0.5;

// Pomodoro Rewards
export const XP_POMODORO_WORK = 250;
export const XP_POMODORO_BREAK = 125;
export const POMODORO_WORK_TIME = 25 * 60; // 25 minutes in seconds
export const POMODORO_BREAK_TIME = 5 * 60; // 5 minutes in seconds

export const INITIAL_SKILLS = [
  { id: 'focus', name: 'Focus', description: 'Concentration on a single task', icon: '🎯' },
  { id: 'lore', name: 'Lore', description: 'Knowledge gathering and research', icon: '📜' },
  { id: 'creativity', name: 'Creativity', description: 'Imaginative thinking and arts', icon: '✨' },
  { id: 'discipline', name: 'Discipline', description: 'Consistency and work ethic', icon: '🛡️' },
];

export const PRESET_AVATARS = [
  'https://picsum.photos/id/1027/200/200',
  'https://picsum.photos/id/177/200/200',
  'https://picsum.photos/id/445/200/200',
  'https://picsum.photos/id/64/200/200',
  'https://picsum.photos/id/22/200/200',
];

export const ACHIEVEMENT_THRESHOLDS: AchievementThresholds = {
  notesCreated: [10, 25, 50, 100, 250, 500, 1000, 5000],
  notesUpdated: [10, 25, 50, 100, 250, 500, 1000, 5000],
  notesDeleted: [10, 25, 50, 100, 250, 500, 1000, 5000],
  levels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 500, 1000],
  glyphs: [1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000],
  words: [1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000],
};

export const MAX_ACHIEVEMENT_POINTS = (
  ACHIEVEMENT_THRESHOLDS.notesCreated.length +
  ACHIEVEMENT_THRESHOLDS.notesUpdated.length +
  ACHIEVEMENT_THRESHOLDS.notesDeleted.length +
  ACHIEVEMENT_THRESHOLDS.levels.length +
  ACHIEVEMENT_THRESHOLDS.glyphs.length +
  ACHIEVEMENT_THRESHOLDS.words.length
) * 10;

export const ACHIEVEMENT_QUOTES = [
  "The ink of destiny never fades, Scribe.",
  "A single word can topple empires; a thousand can rebuild them.",
  "Wisdom is the only weapon that grows sharper with every use.",
  "The Great Library remembers every spill of your silver pen.",
  "Even the oldest scrolls began as a single, humble glyph.",
  "Through darkness and ink, the Chronicler finds the light of truth.",
  "Fate is written only by those who dare to hold the quill.",
  "Great chronicles require both the silence of focus and the sacrifice of time.",
  "Your legacy is being etched into the eternal archives of the void.",
  "Mastery is not a destination, but a path paved in ancient parchment.",
];

export const INITIAL_USER: UserStats = {
  bookTitle: 'Eldritch Notes',
  avatar: PRESET_AVATARS[0],
  level: 1,
  xp: 0,
  skillPoints: 0,
  skills: {
    focus: 0,
    lore: 0,
    creativity: 0,
    discipline: 0,
  },
  notesCreatedCount: 0,
  notesUpdatedCount: 0,
  notesDeletedCount: 0,
  totalGlyphsCount: 0,
  totalWordsCount: 0,
  unlockedAchievements: [],
  achievementPoints: 0,
};

export const DEFAULT_NOTE: Note = {
  id: '1',
  title: 'Welcome to Eldritch Notes',
  content: '# Your Journey Begins\n\nWriting here grants you XP. Explore the character sheet in the bottom left to see your progress.',
  tags: ['tutorial', 'welcome'],
  isPinned: true,
  isDeleted: false,
  color: '#a855f7',
  updatedAt: Date.now(),
  createdAt: Date.now(),
};
