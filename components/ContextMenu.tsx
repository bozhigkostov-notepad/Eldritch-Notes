
import React, { useEffect, useState } from 'react';
import { ContextMenuItem } from '../types';

interface ContextMenuProps {
  items: ContextMenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ items }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => setVisible(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed z-[1000] min-w-[200px] bg-slate-900/95 border border-purple-500/30 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in zoom-in duration-200"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-1 space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              item.action();
              setVisible(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-white rounded transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 group-hover:border-purple-500/50">
                {item.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContextMenu;
