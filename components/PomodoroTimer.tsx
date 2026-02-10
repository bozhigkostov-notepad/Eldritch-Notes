
import React, { useState, useEffect, useRef } from 'react';
import { POMODORO_WORK_TIME, POMODORO_BREAK_TIME, XP_POMODORO_WORK, XP_POMODORO_BREAK } from '../constants';

interface PomodoroTimerProps {
  onGainXp: (amount: number) => void;
}

type TimerMode = 'WORK' | 'BREAK';

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onGainXp }) => {
  const [mode, setMode] = useState<TimerMode>('WORK');
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<any>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mode === 'WORK') {
      onGainXp(XP_POMODORO_WORK);
      setMode('BREAK');
      setTimeLeft(POMODORO_BREAK_TIME);
      alert("📜 The work ritual is complete! 250 XP gained. Rest your mind, scribe.");
    } else {
      onGainXp(XP_POMODORO_BREAK);
      setMode('WORK');
      setTimeLeft(POMODORO_WORK_TIME);
      alert("✨ Your spirit is refreshed. 125 XP gained. Ready for the next chronicle?");
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(POMODORO_WORK_TIME);
    setMode('WORK');
  };

  const skipBreak = () => {
    setIsActive(false);
    setMode('WORK');
    setTimeLeft(POMODORO_WORK_TIME);
  };

  const isBreak = mode === 'BREAK';

  return (
    <div className="relative">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 border border-purple-500/40 rounded shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in duration-150">
          <div className="text-[10px] text-purple-300 font-bold uppercase tracking-widest mb-1">
            {isBreak ? '🍵 Break Ritual' : '🍅 Focus Ritual'}
          </div>
          <div className="text-[9px] text-slate-400 italic">
            {isBreak 
              ? `Rest for 5 minutes to restore your spirit and earn ${XP_POMODORO_BREAK} XP.` 
              : `Concentrate for 25 minutes on your work to earn ${XP_POMODORO_WORK} XP.`}
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-purple-500/40 rotate-45"></div>
        </div>
      )}

      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center justify-between px-3 py-2 border rounded-xl transition-all duration-500 ${
          isBreak 
            ? 'bg-indigo-950/20 border-indigo-500/30' 
            : 'bg-purple-900/10 border-purple-500/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm">{isBreak ? '🍵' : '🍅'}</span>
          <div className="flex flex-col">
            <span className={`text-[10px] font-mono font-bold leading-none ${isActive ? 'text-white' : 'text-slate-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={toggleTimer}
            className={`p-1.5 rounded-lg transition-colors ${
              isBreak 
                ? 'text-indigo-400 hover:bg-indigo-500/20' 
                : 'text-purple-400 hover:bg-purple-500/20'
            }`}
            title={isActive ? 'Pause Ritual' : 'Resume Ritual'}
          >
            {isActive ? '⏸' : '▶'}
          </button>
          
          {isBreak ? (
            <button 
              onClick={skipBreak}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors text-[10px]"
              title="End Break"
            >
              ✕
            </button>
          ) : (
            <button 
              onClick={resetTimer}
              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-300 hover:bg-purple-500/10 transition-colors text-[10px]"
              title="Reset Ritual"
            >
              ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
