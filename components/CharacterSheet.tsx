
import React, { useState } from 'react';
import { UserStats } from '../types';
import { INITIAL_SKILLS, XP_PER_LEVEL, MAX_ACHIEVEMENT_POINTS } from '../constants';

interface CharacterSheetProps {
  stats: UserStats;
  onClose: () => void;
  onAddSkill: (skillId: string, amount: number) => void;
  onUpdateStats: (updates: Partial<UserStats>) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ stats, onClose, onAddSkill, onUpdateStats }) => {
  const currentXp = stats.xp % XP_PER_LEVEL;
  const progressPercent = (currentXp / XP_PER_LEVEL) * 100;
  const achievementPercent = (stats.achievementPoints / MAX_ACHIEVEMENT_POINTS) * 100;
  
  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(INITIAL_SKILLS.map(s => [s.id, 1]))
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(stats.bookTitle);

  const handleAmountChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setAmounts(prev => ({ ...prev, [id]: Math.max(0, num) }));
  };

  const handleTitleSubmit = () => {
    onUpdateStats({ bookTitle: tempTitle || 'Untitled Book' });
    setIsEditingTitle(false);
  };

  const firstLetter = stats.bookTitle.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-purple-500/50 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
        {/* Header Ribbon - Editable Title */}
        <div className="h-12 bg-gradient-to-r from-purple-900/50 via-purple-600/50 to-purple-900/50 border-b border-purple-500/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3 flex-1 mr-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input 
                  autoFocus
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  className="bg-slate-950 border border-purple-500/50 text-purple-100 px-2 py-0.5 rounded text-sm outline-none w-full rpg-font"
                />
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 cursor-none hover:text-white transition-colors group"
                onClick={() => setIsEditingTitle(true)}
              >
                <h2 className="rpg-font text-sm tracking-widest text-purple-200 truncate max-w-[300px] uppercase">
                  {stats.bookTitle}
                </h2>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
          {/* Left Column: Avatar (First Letter) & Basic Stats */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-t from-purple-500 to-transparent opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
              <div className="relative w-40 h-40 rounded-full border-4 border-purple-500/40 p-1 bg-slate-950 flex items-center justify-center shadow-2xl overflow-hidden">
                <span className="text-7xl font-bold text-purple-400 rpg-font select-none">{firstLetter}</span>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold shadow-lg border border-purple-400 rpg-font transition-transform group-hover:scale-110">
                {stats.level}
              </div>
            </div>

            <div className="w-full space-y-4 pt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-purple-200 rpg-font px-1 uppercase tracking-widest">
                  <span>Experience</span>
                  <span>{currentXp} / {XP_PER_LEVEL}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-yellow-500 rpg-font px-1 uppercase tracking-widest">
                  <span>Achievements</span>
                  <span>{stats.achievementPoints} / {MAX_ACHIEVEMENT_POINTS}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-600 to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${achievementPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
                <h3 className="text-xl rpg-font text-white uppercase tracking-wider">{stats.bookTitle}</h3>
                <p className="text-slate-400 italic text-xs mt-1">"A Legendary Chronicle Unfolding"</p>
            </div>
          </div>

          {/* Right Column: Skills */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg rpg-font text-purple-200">Skills</h3>
              <div className="bg-purple-900/50 border border-purple-500/50 px-3 py-1 rounded text-xs text-purple-100 animate-pulse">
                {stats.skillPoints} SP Available
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {INITIAL_SKILLS.map((skill) => {
                const level = stats.skills[skill.id] || 0;
                const currentAmount = amounts[skill.id] || 1;
                const canAfford = stats.skillPoints >= currentAmount && currentAmount > 0;
                
                return (
                  <div key={skill.id} className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg flex items-center justify-between group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{skill.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-200">{skill.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Rank {level}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <input 
                            type="number"
                            min="1"
                            max={stats.skillPoints}
                            value={currentAmount}
                            onChange={(e) => handleAmountChange(skill.id, e.target.value)}
                            className="w-10 h-8 bg-slate-900 border border-slate-700 text-xs text-center rounded text-purple-300 focus:border-purple-500 outline-none"
                            placeholder="Amt"
                        />
                        <button
                          onClick={() => onAddSkill(skill.id, currentAmount)}
                          disabled={!canAfford}
                          className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                            canAfford 
                              ? 'border-purple-500/50 hover:bg-purple-500 text-purple-400 hover:text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                              : 'border-slate-700 text-slate-600 opacity-50'
                          }`}
                          title={`Spend ${currentAmount} SP`}
                        >
                          +
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 italic text-center mt-4">
              Allocate your essence to refine the book's destiny.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
