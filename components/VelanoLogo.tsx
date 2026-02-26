import React from 'react';

interface VelanoLogoProps {
  size?: number;
  className?: string;
  variant?: 'icon' | 'full' | 'vertical'; // icon only, full horizontal, vertical stack
  textColor?: string;
}

export const VelanoLogo: React.FC<VelanoLogoProps> = ({ 
    size = 40, 
    className = "", 
    variant = 'icon',
    textColor = "text-white"
}) => {
  
  // NEON CYBER LOGO (Based on the image provided)
  // Concept: Neon Shield with split "V" (Cyan to Purple/Pink)
  const Icon = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="shrink-0"
    >
      <defs>
        {/* Main Gradient: Cyan -> Purple -> Pink */}
        <linearGradient id="neon_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
          <stop offset="50%" stopColor="#8b5cf6" /> {/* Violet */}
          <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia */}
        </linearGradient>

        {/* Glow Filter for Neon Effect */}
        <filter id="neon_glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Sharp Glare */}
        <linearGradient id="sharp_glare" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* --- SHIELD OUTLINE --- */}
      {/* Outer Glow */}
      <path 
        d="M50 5 L92 25 V60 L50 95 L8 60 V25 Z" 
        stroke="url(#neon_grad)" 
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#neon_glow)"
        opacity="0.6"
      />
      
      {/* Main Shield Line */}
      <path 
        d="M50 5 L92 25 V60 L50 95 L8 60 V25 Z" 
        stroke="url(#neon_grad)" 
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* --- THE "V" SHAPE --- */}
      {/* Left part of V (Cyan dominant) */}
      <path 
        d="M25 30 L46 70 L55 70 L38 30 Z" 
        fill="#06b6d4"
        stroke="#22d3ee"
        strokeWidth="1"
        filter="url(#neon_glow)"
        opacity="0.9"
      />
      
      {/* Right part of V (Purple dominant) */}
      <path 
        d="M75 30 L54 70 L45 70 L62 30 Z" 
        fill="#d946ef"
        stroke="#e879f9"
        strokeWidth="1"
        filter="url(#neon_glow)"
        opacity="0.9"
      />
      
      {/* Center sharp cut (Negative space or intersection) */}
      <path 
        d="M50 75 L42 55 L58 55 Z" 
        fill="#0f172a" // Background color to simulate cut
        opacity="0.8"
      />

      {/* Top Highlights (Glare) */}
      <path d="M15 28 L50 10 L85 28" stroke="url(#sharp_glare)" strokeWidth="1" opacity="0.5" />

    </svg>
  );

  // Variant: Icon Only
  if (variant === 'icon') {
      return <div className={className}><Icon /></div>;
  }

  // Variant: Vertical (Big for Login)
  if (variant === 'vertical') {
      return (
          <div className={`flex flex-col items-center gap-4 ${className}`}>
              <div className="transform hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Icon />
              </div>
              <div className={`font-sans tracking-tight text-center ${textColor}`}>
                  {/* Neon Text Effect */}
                  <h1 className="text-4xl font-extrabold tracking-widest font-sans uppercase"
                      style={{ 
                          background: 'linear-gradient(to right, #22d3ee, #c084fc, #f0abfc)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 5px rgba(192, 132, 252, 0.5))'
                      }}>
                    VELANO
                  </h1>
              </div>
          </div>
      );
  }

  // Variant: Full Horizontal (For Sidebar/Header)
  return (
      <div className={`flex items-center gap-3 ${className}`}>
          <div className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
             <Icon />
          </div>
          <div className={`font-sans tracking-tight leading-none ${textColor} flex flex-col justify-center`}>
              <span className="text-xl font-bold uppercase tracking-wider"
                    style={{ 
                          background: 'linear-gradient(to right, #22d3ee, #c084fc)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                      }}>
                VELANO
              </span>
          </div>
      </div>
  );
};