
import React from 'react';
import { Note, UserStats } from '../types';
import { INITIAL_SKILLS } from '../constants';
import PomodoroTimer from './PomodoroTimer';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  userStats: UserStats;
  onOpenCharacterSheet: () => void;
  currentView: 'library' | 'catacombs';
  onSwitchView: (view: 'library' | 'catacombs') => void;
  onGainXp: (amount: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onNewNote, 
  userStats, 
  onOpenCharacterSheet,
  currentView,
  onSwitchView,
  onGainXp
}) => {
  const isCatacombs = currentView === 'catacombs';
  
  // Filter notes based on view
  const filteredNotes = notes.filter(n => isCatacombs ? n.isDeleted : !n.isDeleted);
  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned);

  const renderNoteButton = (note: Note) => (
    <button
      key={note.id}
      onClick={() => onSelectNote(note.id)}
      className={`w-full text-left p-2.5 rounded-lg transition-all group border ${
        activeNoteId === note.id 
          ? isCatacombs ? 'bg-indigo-900/30 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.1)]' : 'bg-purple-600/20 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
          : 'hover:bg-slate-800/50 border-transparent'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {note.isPinned && <span className="text-[10px] animate-pulse text-purple-400">📌</span>}
        <div className={`text-sm font-medium truncate ${activeNoteId === note.id ? isCatacombs ? 'text-indigo-200' : 'text-purple-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
          {note.title || 'Untitled Scroll'}
        </div>
      </div>

      {/* Tags Preview */}
      {note.tags.length > 0 && (
        <div className="flex gap-1 overflow-hidden whitespace-nowrap mb-1 mask-linear-right">
          {note.tags.map(tag => (
            <span key={tag} className={`text-[9px] ${isCatacombs ? 'bg-indigo-500/10 text-indigo-400/70 border-indigo-500/20' : 'bg-purple-500/10 text-purple-400/70 border-purple-500/20'} border px-1 rounded flex-shrink-0`}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-[10px] text-slate-600 truncate flex items-center gap-2 mt-auto">
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
      </div>
    </button>
  );

  const firstLetter = userStats.bookTitle.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={`w-72 h-full flex flex-col border-r transition-colors duration-500 backdrop-blur-xl z-10 ${isCatacombs ? 'bg-slate-950/95 border-indigo-900/40' : 'bg-slate-950/90 border-slate-800'}`}>
      {/* Header Profile */}
      <div className="p-6 border-b border-slate-800/50 space-y-4">
        <div 
          onClick={onOpenCharacterSheet}
          className="cursor-none hover:bg-white/5 transition-colors group p-2 rounded-xl -m-2"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 bg-slate-900 flex items-center justify-center text-xl font-bold text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform rpg-font">
                {firstLetter}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-purple-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-slate-900 ring-1 ring-purple-400 shadow-lg">
                {userStats.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors truncate rpg-font tracking-wide">
                {userStats.bookTitle}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold italic">Open Chronicle</div>
            </div>
          </div>
          
          <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-purple-700 to-fuchsia-500 transition-all duration-700 shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
              style={{ width: `${(userStats.xp % 1000) / 10}%` }}
            />
          </div>
        </div>

        {/* Permanent Pomodoro Ritual Timer */}
        <PomodoroTimer onGainXp={onGainXp} />

        {/* Skill Badges Summary */}
        <div className="flex flex-wrap gap-2 pt-2">
          {INITIAL_SKILLS.map((skill) => {
            const level = userStats.skills[skill.id] || 0;
            return (
              <div 
                key={skill.id} 
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all duration-300 ${
                  level > 0 
                    ? 'bg-purple-900/30 border-purple-500/40 text-purple-200' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-600'
                }`}
                title={`${skill.name}: Rank ${level}`}
              >
                <span className={`text-xs ${level === 0 ? 'grayscale' : ''}`}>{skill.icon}</span>
                <span className="text-[10px] font-bold">{level}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4 border-b border-slate-800/30 bg-slate-900/10">
        <button 
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-3 py-3 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold transition-all group shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
          <span className="rpg-font tracking-[0.2em] uppercase">New Chronicle</span>
        </button>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pt-4 pb-12 relative">
        {isCatacombs && <div className="absolute inset-0 bg-indigo-900/5 pointer-events-none mix-blend-overlay animate-pulse"></div>}

        {pinnedNotes.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-[10px] text-purple-400 uppercase tracking-widest font-bold px-2 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
              Pinned Manuscripts
            </h4>
            {pinnedNotes.map(renderNoteButton)}
          </div>
        )}

        <div className="space-y-1">
          {unpinnedNotes.length > 0 && (
            <h4 className={`text-[10px] uppercase tracking-widest font-bold px-2 mb-2 flex items-center gap-2 ${isCatacombs ? 'text-indigo-500' : 'text-slate-500'}`}>
               <span className={`w-1 h-1 rounded-full ${isCatacombs ? 'bg-indigo-600' : 'bg-slate-600'}`}></span>
               {isCatacombs ? 'Forgotten Catacombs' : 'Manuscripts'}
            </h4>
          )}
          {unpinnedNotes.map(renderNoteButton)}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center mt-10 text-slate-600 text-xs italic opacity-50">
             {isCatacombs ? 'The catacombs are empty...' : 'The library is empty...'}
          </div>
        )}
      </div>

      {/* Footer View Toggle */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-950 flex flex-col gap-2">
        <button 
          onClick={() => onSwitchView(isCatacombs ? 'library' : 'catacombs')}
          className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border ${
            isCatacombs 
            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-purple-500/50' 
            : 'bg-indigo-950/20 border-indigo-900/30 text-indigo-500/60 hover:text-indigo-400 hover:bg-indigo-900/20'
          }`}
        >
          {isCatacombs ? (
            <><span>🏛️</span> Return to Library</>
          ) : (
            <><span>💀</span> Descend to Catacombs</>
          )}
        </button>
      </div>

      <style>{`
        .mask-linear-right {
          mask-image: linear-gradient(to right, black 80%, transparent 100%);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
