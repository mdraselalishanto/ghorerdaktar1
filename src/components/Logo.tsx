import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG matching Ghorer Daktar Logo */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Green House Roof */}
          <path
            d="M 20 95 L 100 20 L 180 95"
            stroke="#2EBD59"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Navy Blue Inner House Walls */}
          <path
            d="M 38 92 L 100 38 L 162 92 L 162 172 L 38 172 Z"
            stroke="#0A66C2"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stethoscope Earpieces */}
          <circle cx="80" cy="88" r="8" fill="#0A66C2" />
          <circle cx="120" cy="88" r="8" fill="#0A66C2" />

          {/* Stethoscope Tubing forming Heart */}
          <path
            d="M 80 96 C 80 120, 60 115, 60 132 C 60 152, 100 168, 100 168 C 100 168, 140 152, 140 132 C 140 115, 120 120, 120 96"
            stroke="#0A66C2"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Green Heart inside Stethoscope */}
          <path
            d="M 100 128 C 94 118, 82 118, 82 128 C 82 138, 100 148, 100 148 C 100 148, 118 138, 118 128 C 118 118, 106 118, 100 128 Z"
            fill="#2EBD59"
          />

          {/* Wi-Fi Signal Symbol Top Right */}
          <path
            d="M 142 35 A 25 25 0 0 1 178 35"
            stroke="#2EBD59"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 150 45 A 15 15 0 0 1 170 45"
            stroke="#2EBD59"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="160" cy="54" r="4.5" fill="#0A66C2" />

          {/* Small Pill & Leaf Bottom Right */}
          <rect x="125" y="148" width="28" height="14" rx="7" fill="#0A66C2" transform="rotate(-15 125 148)" />
          <path d="M 130 142 Q 138 132 144 140 Q 138 146 130 142 Z" fill="#2EBD59" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black font-hind tracking-tight ${textSizes[size]}`}>
            <span className="text-[#0A66C2] dark:text-blue-400">ঘরের</span>{' '}
            <span className="text-[#2EBD59]">ডাক্তার</span>
          </span>
          <span className={`font-bold font-hind text-slate-500 dark:text-slate-400 ${subTextSizes[size]}`}>
            স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা
          </span>
        </div>
      )}
    </div>
  );
};
