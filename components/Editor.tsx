
import React, { useState } from 'react';
import { Note } from '../types';

interface EditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onBury: () => void;
  onRestore: () => void;
  onDeletePermanent: () => void;
  onConsultSage: () => void;
  isSageThinking: boolean;
  sageAdvice: string | null;
}

const Editor: React.FC<EditorProps> = ({ 
  note, 
  onUpdate, 
  onBury,
  onRestore,
  onDeletePermanent,
  onConsultSage, 
  isSageThinking, 
  sageAdvice 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isDeleted = note.isDeleted;

  return (
    <div className={`flex-1 flex flex-col h-full relative transition-colors duration-500 ${isDeleted ? 'bg-indigo-950/10' : 'bg-[#1e1e2e]/30'}`}>
      {/* Top Toolbar */}
      <div className={`h-16 border-b flex items-center justify-between px-8 backdrop-blur-md z-20 ${isDeleted ? 'bg-indigo-950/40 border-indigo-900/30' : 'bg-slate-900/60 border-slate-800/50'}`}>
        <div className="flex items-center gap-6 flex-1">
           <input
            type="text"
            value={note.title}
            onChange={(e) => !isDeleted && onUpdate(note.id, { title: e.target.value })}
            readOnly={isDeleted}
            placeholder="Chronicling name..."
            className={`bg-transparent text-2xl font-bold outline-none w-full max-w-2xl placeholder:text-slate-700 rpg-font tracking-tight selection:bg-purple-500/50 ${isDeleted ? 'text-indigo-300/50 cursor-not-allowed' : 'text-slate-100'}`}
          />
        </div>
        
        <div className="flex items-center gap-3 relative">
          {!isDeleted && (
            <button
              onClick={() => onUpdate(note.id, { isPinned: !note.isPinned })}
              className={`p-2.5 rounded-full hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 ${note.isPinned ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' : 'text-slate-500'}`}
              title="Pin Manuscript to the Top"
            >
              📌
            </button>
          )}

          {isDeleted ? (
             <div className="flex items-center gap-2">
                <button
                  onClick={onRestore}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30 transition-all uppercase tracking-widest"
                >
                  🪄 Exhume Scroll
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Incinerate this scroll forever? It cannot be recovered.")) {
                      onDeletePermanent();
                    }
                  }}
                  className="p-2.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 transition-all"
                  title="Incinerate Permanently"
                >
                  🔥
                </button>
             </div>
          ) : (
            <>
              <button
                onClick={onBury}
                className="p-2.5 rounded-full hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 text-slate-500 hover:text-indigo-400"
                title="Bury in the Catacombs"
              >
                💀
              </button>
              
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={onConsultSage}
                  disabled={isSageThinking}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 active:scale-95 rpg-font tracking-widest"
                >
                  {isSageThinking ? '🔮 Scrying...' : '🧙‍♂️ Consult Sage'}
                </button>

                {/* Sage Tooltip */}
                {showTooltip && !isSageThinking && (
                  <div className="absolute top-full mt-3 right-0 w-64 p-3 bg-slate-900 border border-purple-500/50 rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in duration-150">
                    <div className="text-[10px] text-purple-300 uppercase font-bold mb-1 tracking-tighter">The Sage's Wisdom</div>
                    <div className="text-xs text-slate-400 leading-relaxed italic">
                      Ask the ancient spirits to analyze your manuscripts. They will weave your words into a brief summary and grant you three sparks of divine inspiration to further your journey.
                    </div>
                    <div className="absolute -top-1 right-10 w-2 h-2 bg-slate-900 border-l border-t border-purple-500/50 rotate-45"></div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-12 max-w-4xl mx-auto w-full relative">
        {isDeleted && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-grayscale-[0.5] z-10 pointer-events-none"></div>
        )}

        {/* Tags Row - Automatic Only */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold mr-2 tracking-widest">Active Inscriptions:</span>
            {note.tags.length > 0 ? note.tags.map((tag) => (
                <div key={tag} className={`bg-purple-500/5 border border-purple-500/20 text-purple-400/80 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 group transition-all ${!isDeleted && 'hover:bg-purple-500/10'}`}>
                    #{tag}
                </div>
            )) : (
              <span className="text-[10px] text-slate-700 italic">No runes found in text...</span>
            )}
        </div>

        <textarea
          value={note.content}
          onChange={(e) => !isDeleted && onUpdate(note.id, { content: e.target.value })}
          readOnly={isDeleted}
          placeholder="Begin your odyssey here, traveler... Use #hashtags to create automatic inscriptions."
          className={`w-full h-full bg-transparent resize-none outline-none leading-relaxed text-lg font-light font-['Quicksand'] selection:bg-purple-500/30 ${isDeleted ? 'text-indigo-300/30 cursor-not-allowed placeholder:text-indigo-900/20' : 'text-slate-200 placeholder:text-slate-800'}`}
        />

        {/* Sage Advice Modal/Section */}
        {sageAdvice && (
          <div className="mt-12 p-8 bg-slate-900/40 border border-purple-500/20 rounded-2xl relative overflow-hidden animate-in slide-in-from-bottom-6 duration-700 shadow-2xl backdrop-blur-sm group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onUpdate(note.id, { content: note.content })} className="text-slate-600 hover:text-white">&times;</button>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent"></div>
            <div className="flex items-start gap-6">
                <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🧙‍♂️</div>
                <div>
                    <h4 className="rpg-font text-xl text-purple-200 mb-3 tracking-widest">The Sage's Revelation</h4>
                    <div className="text-sm text-slate-400 italic whitespace-pre-wrap leading-relaxed font-light">
                        {sageAdvice}
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className={`h-10 border-t px-8 flex items-center justify-between text-[10px] backdrop-blur-sm ${isDeleted ? 'bg-indigo-950/40 border-indigo-900/30 text-indigo-500/50' : 'bg-slate-900/30 border-slate-800/40 text-slate-600'}`}>
        <div className="flex gap-6 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1.5"><span className={`w-1 h-1 rounded-full ${isDeleted ? 'bg-indigo-900' : 'bg-slate-700'}`}></span> {note.content.length} Glyphs</span>
            <span className="flex items-center gap-1.5"><span className={`w-1 h-1 rounded-full ${isDeleted ? 'bg-indigo-900' : 'bg-slate-700'}`}></span> {note.content.split(/\s+/).filter(Boolean).length} Words</span>
        </div>
        <div className="italic font-medium">
          {isDeleted ? 'Preserved' : 'Refined'} at {new Date(note.updatedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Editor;
