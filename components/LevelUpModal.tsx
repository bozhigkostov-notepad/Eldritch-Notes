
import React, { useEffect } from 'react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  useEffect(() => {
    // Optional: play sound
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-500">
      <div className="relative text-center space-y-8 animate-in zoom-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 animate-pulse" />
          <h1 className="text-6xl md:text-8xl rpg-font text-white glow-text italic">Level Up!</h1>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-500" />
          <div className="text-4xl rpg-font text-purple-300">New Rank: {level}</div>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-500" />
        </div>

        <p className="text-slate-300 max-w-md mx-auto">
          Your wisdom grows as your ink flows. You have gained <span className="text-purple-400 font-bold">+1 Skill Point</span>.
        </p>

        <button
          onClick={onClose}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg rpg-font tracking-widest shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
        >
          Claim Glory
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
