
import React, { useMemo, useEffect, useRef } from 'react';
import { ACHIEVEMENT_QUOTES } from '../constants';

interface AchievementModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ title, description, onClose }) => {
  const quote = useMemo(() => ACHIEVEMENT_QUOTES[Math.floor(Math.random() * ACHIEVEMENT_QUOTES.length)], []);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Auto-focus the button for immediate keyboard interaction
    buttonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-yellow-500/50 rounded-2xl p-8 text-center space-y-6 animate-in zoom-in slide-in-from-top-12 duration-700 shadow-[0_0_60px_rgba(234,179,8,0.2)]">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-slate-900 border-4 border-yellow-500/50 rounded-full flex items-center justify-center text-4xl shadow-xl">
          🏆
        </div>

        <div className="space-y-2 pt-4">
          <h2 className="rpg-font text-3xl text-yellow-500 tracking-widest glow-text">Achievement Unlocked</h2>
          <div className="text-xl font-bold text-white uppercase tracking-tight">{title}</div>
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl italic text-slate-400 text-sm leading-relaxed">
          "{quote}"
        </div>

        <p className="text-slate-300 font-medium">
          {description}
        </p>

        <div className="text-yellow-500 font-bold rpg-font tracking-widest animate-pulse">
          +10 Achievement Points
        </div>

        <button
          ref={buttonRef}
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-xl rpg-font tracking-[0.2em] shadow-lg shadow-yellow-900/30 transition-all active:scale-95 outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Accept Honor
        </button>
      </div>
    </div>
  );
};

export default AchievementModal;
