
import React, { useState } from 'react';
import { UserStats } from '../types';
import { INITIAL_SKILLS, XP_PER_LEVEL } from '../constants';

interface CharacterSheetProps {
  stats: UserStats;
  onClose: () => void;
  onAddSkill: (skillId: string, amount: number) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ stats, onClose, onAddSkill }) => {
  const currentXp = stats.xp % XP_PER_LEVEL;
  const progressPercent = (currentXp / XP_PER_LEVEL) * 100;
  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(INITIAL_SKILLS.map(s => [s.id, 1]))
  );

  const handleAmountChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setAmounts(prev => ({ ...prev, [id]: Math.max(0, num) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-purple-500/50 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
        {/* Header Ribbon */}
        <div className="h-12 bg-gradient-to-r from-purple-900/50 via-purple-600/50 to-purple-900/50 border-b border-purple-500/30 flex items-center justify-between px-6">
          <h2 className="rpg-font text-xl tracking-widest text-purple-200">Character Sheet</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Avatar & Basic Stats */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-t from-purple-500 to-transparent opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
              <div className="relative w-40 h-40 rounded-full border-4 border-purple-500/40 p-1 bg-slate-800 overflow-hidden shadow-2xl">
                <img src={stats.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg border border-purple-400 rpg-font">
                LVL {stats.level}
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-purple-200 rpg-font px-1">
                <span>Experience</span>
                <span>{currentXp} / {XP_PER_LEVEL}</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-center">
                <h3 className="text-2xl rpg-font text-white">{stats.name}</h3>
                <p className="text-slate-400 italic">"The Chronicler of Thoughts"</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/50 px-4 py-1.5 rounded-lg border border-slate-700">
                  <span className="text-orange-400">🔥</span>
                  <span className="text-sm font-bold">{stats.streak} Day Streak</span>
                </div>
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
                        <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Level {level}</div>
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
              Allocate skill points to reflect your creative evolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
