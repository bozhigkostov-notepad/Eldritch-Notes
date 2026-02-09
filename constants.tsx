
import React from 'react';
import { Note, UserStats } from './types';

export const XP_PER_LEVEL = 1000;
export const XP_PER_NOTE = 50;
export const XP_PER_TAG = 10;
export const XP_PER_CHAR = 0.5;

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

export const INITIAL_USER: UserStats = {
  name: 'Traveling Scribe',
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
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
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
