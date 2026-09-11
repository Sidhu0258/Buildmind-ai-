import React from 'react';

interface BMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BMLogo: React.FC<BMLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric BM Construction-Tech App Icon */}
      <div 
        id="bm-logo-icon"
        className={`${iconDimensions[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-1.5 shadow-md shadow-slate-900/15 border border-slate-700/60 transition-transform duration-200 hover:scale-105`}
        title="BuildMind AI"
      >
        {/* Architectural grid background texture inside mark */}
        <svg 
          viewBox="0 0 44 44" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Subtle structural grid lines */}
          <line x1="6" y1="22" x2="38" y2="22" stroke="#334155" strokeWidth="0.75" strokeDasharray="1 2" />
          <line x1="22" y1="6" x2="22" y2="38" stroke="#334155" strokeWidth="0.75" strokeDasharray="1 2" />

          {/* Letter 'B' - Architectural Structural Geometry */}
          <path 
            d="M 9 9 L 19 9 C 22.5 9 24.5 11 24.5 14.2 C 24.5 16.5 23.2 18.2 21 19 C 23.8 19.8 25.2 21.8 25.2 24.8 C 25.2 28.5 22.5 31 18.5 31 L 9 31 Z" 
            fill="none" 
            stroke="#F59E0B" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 10 20 L 20 20" 
            stroke="#F59E0B" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
          />

          {/* Letter 'M' - Chevron Structural Trusses with AI Apex Node */}
          <path 
            d="M 23 31 L 23 15 L 29 23.5 L 35 15 L 35 31" 
            fill="none" 
            stroke="#38BDF8" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Intelligent AI Nexus Nodes */}
          <circle cx="29" cy="23.5" r="2" fill="#F59E0B" />
          <circle cx="23" cy="15" r="1.5" fill="#38BDF8" />
          <circle cx="35" cy="15" r="1.5" fill="#38BDF8" />
        </svg>

        {/* Ambient Corner Accent */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 blur-[1px] opacity-80" />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold text-slate-900 tracking-tight ${textSizes[size]}`}>
            BuildMind
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-300/80 text-amber-700 font-bold text-xs tracking-wider shadow-2xs">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
