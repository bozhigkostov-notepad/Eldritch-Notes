
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Note, UserStats, ContextMenuItem } from './types';
import { 
  INITIAL_USER, 
  DEFAULT_NOTE, 
  XP_PER_LEVEL, 
  XP_PER_NOTE, 
  XP_PER_TAG, 
  XP_PER_CHAR,
  ACHIEVEMENT_THRESHOLDS
} from './constants';
import { geminiService } from './services/geminiService';

// Components
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import CharacterSheet from './components/CharacterSheet';
import LevelUpModal from './components/LevelUpModal';
import AchievementModal from './components/AchievementModal';
import CustomCursor from './components/CustomCursor';
import ContextMenu from './components/ContextMenu';

const App: React.FC = () => {
  // State
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('eldritch_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({ ...n, isDeleted: !!n.isDeleted }));
    }
    return [DEFAULT_NOTE];
  });
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [currentView, setCurrentView] = useState<'library' | 'catacombs'>('library');
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('eldritch_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [pendingAchievement, setPendingAchievement] = useState<{title: string, description: string} | null>(null);
  const [isSageThinking, setIsSageThinking] = useState(false);
  const [sageAdvice, setSageAdvice] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('eldritch_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('eldritch_user', JSON.stringify(userStats));
  }, [userStats]);

  // Derived
  const activeNote = useMemo(() => 
    notes.find(n => n.id === activeNoteId),
    [notes, activeNoteId]
  );

  // Achievement Checking Logic
  const checkAchievements = useCallback((stats: UserStats) => {
    const newUnlocked: string[] = [...stats.unlockedAchievements];
    let pointsGained = 0;
    let latestAch: {title: string, description: string} | null = null;

    const tryUnlock = (id: string, title: string, description: string) => {
      if (!newUnlocked.includes(id)) {
        newUnlocked.push(id);
        pointsGained += 10;
        latestAch = { title, description };
      }
    };

    // Threshold checks
    ACHIEVEMENT_THRESHOLDS.notesCreated.forEach(t => {
      if (stats.notesCreatedCount >= t) tryUnlock(`created_${t}`, `Master of Origins: ${t}`, `Created ${t} unique chronicles.`);
    });
    ACHIEVEMENT_THRESHOLDS.notesUpdated.forEach(t => {
      if (stats.notesUpdatedCount >= t) tryUnlock(`updated_${t}`, `Polished Prose: ${t}`, `Refined manuscripts ${t} times.`);
    });
    ACHIEVEMENT_THRESHOLDS.notesDeleted.forEach(t => {
      if (stats.notesDeletedCount >= t) tryUnlock(`deleted_${t}`, `The Grave Digger: ${t}`, `Buried ${t} scrolls in the catacombs.`);
    });
    ACHIEVEMENT_THRESHOLDS.levels.forEach(t => {
      if (stats.level >= t) tryUnlock(`level_${t}`, `Eldritch Rank: ${t}`, `Reached level ${t} in the Great Library.`);
    });
    ACHIEVEMENT_THRESHOLDS.glyphs.forEach(t => {
      if (stats.totalGlyphsCount >= t) tryUnlock(`glyphs_${t}`, `Glyph Smith: ${t}`, `Carved a total of ${t} glyphs across all scrolls.`);
    });
    ACHIEVEMENT_THRESHOLDS.words.forEach(t => {
      if (stats.totalWordsCount >= t) tryUnlock(`words_${t}`, `World Weaver: ${t}`, `Spilled ${t} words of wisdom into existence.`);
    });

    if (pointsGained > 0) {
      setUserStats(prev => ({
        ...prev,
        unlockedAchievements: newUnlocked,
        achievementPoints: prev.achievementPoints + pointsGained
      }));
      if (latestAch) setPendingAchievement(latestAch);
    }
  }, []);

  // Handlers
  const addXp = useCallback((amount: number) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      
      const newStats = { ...prev, xp: newXp };
      
      if (newLevel > oldLevel) {
        setShowLevelUp(true);
        newStats.level = newLevel;
        newStats.skillPoints = prev.skillPoints + (newLevel - oldLevel);
      }
      
      return newStats;
    });
  }, []);

  // Check achievements whenever relevant stats change
  useEffect(() => {
    checkAchievements(userStats);
  }, [userStats.level, userStats.notesCreatedCount, userStats.notesUpdatedCount, userStats.notesDeletedCount, userStats.totalGlyphsCount, userStats.totalWordsCount]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(7),
      title: 'A New Scroll',
      content: '',
      tags: [],
      isPinned: false,
      isDeleted: false,
      color: '#a855f7',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setCurrentView('library');
    addXp(XP_PER_NOTE);
    setUserStats(prev => ({ ...prev, notesCreatedCount: prev.notesCreatedCount + 1 }));
  };

  const calculateTotals = useCallback(() => {
    const totalGlyphs = notes.reduce((acc, n) => acc + n.content.length, 0);
    const totalWords = notes.reduce((acc, n) => acc + n.content.split(/\s+/).filter(Boolean).length, 0);
    setUserStats(prev => ({
      ...prev,
      totalGlyphsCount: Math.max(prev.totalGlyphsCount, totalGlyphs),
      totalWordsCount: Math.max(prev.totalWordsCount, totalWords)
    }));
  }, [notes]);

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        let finalUpdates = { ...updates };
        if (updates.content !== undefined) {
          const charDiff = updates.content.length - n.content.length;
          if (charDiff > 10) addXp(charDiff * XP_PER_CHAR);
          const tags = Array.from(updates.content.matchAll(/#([a-zA-Z0-9_]+)/g)).map(match => match[1]);
          finalUpdates.tags = [...new Set(tags)];
          if (finalUpdates.tags.length > n.tags.length) addXp(XP_PER_TAG);
          
          setUserStats(prev => ({ ...prev, notesUpdatedCount: prev.notesUpdatedCount + 1 }));
        }
        return { ...n, ...finalUpdates, updatedAt: Date.now() };
      }
      return n;
    }));
    calculateTotals();
  };

  const handleBuryNote = (id: string) => {
    handleUpdateNote(id, { isDeleted: true, isPinned: false });
    const remaining = notes.filter(n => n.id !== id && !n.isDeleted);
    if (activeNoteId === id) setActiveNoteId(remaining[0]?.id || '');
    setUserStats(prev => ({ ...prev, notesDeletedCount: prev.notesDeletedCount + 1 }));
  };

  const handleRestoreNote = (id: string) => {
    handleUpdateNote(id, { isDeleted: false });
  };

  const handlePermanentlyDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId('');
    setUserStats(prev => ({ ...prev, notesDeletedCount: prev.notesDeletedCount + 1 }));
  };

  const handleAddSkill = (skillId: string, amount: number) => {
    if (userStats.skillPoints < amount) return;
    setUserStats(prev => ({
      ...prev,
      skillPoints: prev.skillPoints - amount,
      skills: {
        ...prev.skills,
        [skillId]: (prev.skills[skillId] || 0) + amount
      }
    }));
  };

  const handleUpdateStats = (updates: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...updates }));
  };

  const handleConsultSage = async () => {
    if (!activeNote || isSageThinking) return;
    setIsSageThinking(true);
    const result = await geminiService.consultTheSage(activeNote.content);
    setSageAdvice(result);
    setIsSageThinking(false);
    addXp(20);
  };

  const contextMenuItems: ContextMenuItem[] = [
    { id: 'new', label: 'New Chronicle', icon: '✨', action: () => handleCreateNote(), shortcut: 'Ctrl+N' },
    { id: 'sheet', label: 'View Book Profile', icon: '📜', action: () => setIsCharacterSheetOpen(true), shortcut: 'Shift+B' },
    { id: 'sage', label: 'Consult Sage', icon: '🧙‍♂️', action: handleConsultSage },
    { id: 'pin', label: 'Toggle Pin', icon: '📌', action: () => activeNote && handleUpdateNote(activeNote.id, { isPinned: !activeNote.isPinned }) },
    { id: 'bury', label: activeNote?.isDeleted ? 'Exhume Scroll' : 'Bury Scroll', icon: activeNote?.isDeleted ? '🪄' : '💀', action: () => activeNote && (activeNote.isDeleted ? handleRestoreNote(activeNote.id) : handleBuryNote(activeNote.id)) },
  ];

  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-200 selection:bg-purple-500/40 relative overflow-hidden">
      <CustomCursor />
      <ContextMenu items={contextMenuItems} />
      
      <Sidebar 
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onNewNote={handleCreateNote}
        userStats={userStats}
        onOpenCharacterSheet={() => setIsCharacterSheetOpen(true)}
        currentView={currentView}
        onSwitchView={setCurrentView}
        onGainXp={addXp}
      />

      {activeNote ? (
        <Editor 
          note={activeNote}
          onUpdate={handleUpdateNote}
          onBury={() => handleBuryNote(activeNote.id)}
          onRestore={() => handleRestoreNote(activeNote.id)}
          onDeletePermanent={() => handlePermanentlyDeleteNote(activeNote.id)}
          onConsultSage={handleConsultSage}
          isSageThinking={isSageThinking}
          sageAdvice={sageAdvice}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/20 italic text-slate-600 rpg-font tracking-widest animate-pulse gap-4">
            <div className="text-4xl opacity-20">📜</div>
            <div>Select a chronicle to begin...</div>
        </div>
      )}

      {isCharacterSheetOpen && (
        <CharacterSheet 
          stats={userStats}
          onClose={() => setIsCharacterSheetOpen(false)}
          onAddSkill={handleAddSkill}
          onUpdateStats={handleUpdateStats}
        />
      )}

      {showLevelUp && (
        <LevelUpModal 
          level={userStats.level}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {pendingAchievement && (
        <AchievementModal 
          title={pendingAchievement.title}
          description={pendingAchievement.description}
          onClose={() => setPendingAchievement(null)}
        />
      )}

      <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-purple-900/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-indigo-900/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none -z-20"></div>
    </div>
  );
};

export default App;
