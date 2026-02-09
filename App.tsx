
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Note, UserStats, ContextMenuItem } from './types';
import { 
  INITIAL_USER, 
  DEFAULT_NOTE, 
  XP_PER_LEVEL, 
  XP_PER_NOTE, 
  XP_PER_TAG, 
  XP_PER_CHAR 
} from './constants';
import { geminiService } from './services/geminiService';

// Components
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import CharacterSheet from './components/CharacterSheet';
import LevelUpModal from './components/LevelUpModal';
import CustomCursor from './components/CustomCursor';
import ContextMenu from './components/ContextMenu';

const App: React.FC = () => {
  // State
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('eldritch_notes');
    return saved ? JSON.parse(saved) : [DEFAULT_NOTE];
  });
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('eldritch_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
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
    notes.find(n => n.id === activeNoteId) || notes[0],
    [notes, activeNoteId]
  );

  // Handlers
  const addXp = useCallback((amount: number) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      
      if (newLevel > oldLevel) {
        setShowLevelUp(true);
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          skillPoints: prev.skillPoints + (newLevel - oldLevel)
        };
      }
      return { ...prev, xp: newXp };
    });
  }, []);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(7),
      title: 'A New Scroll',
      content: '',
      tags: [],
      isPinned: false,
      color: '#a855f7',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    addXp(XP_PER_NOTE);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        let finalUpdates = { ...updates };

        // Automatic tag extraction
        if (updates.content !== undefined) {
          const charDiff = updates.content.length - n.content.length;
          if (charDiff > 10) addXp(charDiff * XP_PER_CHAR);
          
          // Regex to find #hashtags
          const tags = Array.from(updates.content.matchAll(/#([a-zA-Z0-9_]+)/g)).map(match => match[1]);
          finalUpdates.tags = [...new Set(tags)]; // Unique tags only

          if (finalUpdates.tags.length > n.tags.length) {
            addXp(XP_PER_TAG);
          }
        }

        return { ...n, ...finalUpdates, updatedAt: Date.now() };
      }
      return n;
    }));
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

  const handleConsultSage = async () => {
    if (!activeNote || isSageThinking) return;
    setIsSageThinking(true);
    const result = await geminiService.consultTheSage(activeNote.content);
    setSageAdvice(result);
    setIsSageThinking(false);
    addXp(20);
  };

  // Context Menu Items
  const contextMenuItems: ContextMenuItem[] = [
    { id: 'new', label: 'New Chronicle', icon: '✨', action: () => handleCreateNote(), shortcut: 'Ctrl+N' },
    { id: 'sheet', label: 'View Character Sheet', icon: '📜', action: () => setIsCharacterSheetOpen(true), shortcut: 'Shift+C' },
    { id: 'sage', label: 'Consult Sage', icon: '🧙‍♂️', action: handleConsultSage },
    { id: 'pin', label: 'Toggle Pin', icon: '📌', action: () => activeNote && handleUpdateNote(activeNote.id, { isPinned: !activeNote.isPinned }) },
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
      />

      {activeNote ? (
        <Editor 
          note={activeNote}
          onUpdate={handleUpdateNote}
          onConsultSage={handleConsultSage}
          isSageThinking={isSageThinking}
          sageAdvice={sageAdvice}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-900/20 italic text-slate-600 rpg-font tracking-widest animate-pulse">
            Select a chronicle to begin...
        </div>
      )}

      {isCharacterSheetOpen && (
        <CharacterSheet 
          stats={userStats}
          onClose={() => setIsCharacterSheetOpen(false)}
          onAddSkill={handleAddSkill}
        />
      )}

      {showLevelUp && (
        <LevelUpModal 
          level={userStats.level}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-purple-900/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-indigo-900/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none -z-20"></div>
    </div>
  );
};

export default App;
