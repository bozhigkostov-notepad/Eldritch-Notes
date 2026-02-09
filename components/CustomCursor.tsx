
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.onclick ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.5 : 1})`,
      }}
    >
      {/* Main Core */}
      <div className={`w-3 h-3 bg-purple-400 rounded-full border border-white shadow-[0_0_15px_rgba(168,85,247,0.8)] ${isHovering ? 'animate-pulse' : ''}`} />
      
      {/* Orbital Rune */}
      <div className={`absolute -inset-1 border border-purple-500/30 rounded-full animate-spin [animation-duration:3s]`} />
      
      {/* Trailing Glow */}
      <div className={`absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default CustomCursor;
