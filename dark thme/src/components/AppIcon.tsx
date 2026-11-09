import React from 'react';
import * as Icons from 'lucide-react';
import { IconPackId } from '../types/launcher';

interface AppIconProps {
  iconName: string;
  label: string;
  iconPack: IconPackId;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'squircle' | 'circle';
}

export const AppIcon: React.FC<AppIconProps> = ({
  iconName,
  label,
  iconPack,
  size = 'md',
  shape = 'squircle'
}) => {
  // Dynamic Lucide icon lookup with safe fallback
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[iconName] || Icons.Smartphone;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  }[size];

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26
  }[size];

  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  // Pack specific themes
  const packStyles = {
    amoled_blue: {
      container: 'bg-[#121212] border border-[#262626] hover:border-[#448AFF]/60 shadow-sm',
      iconColor: '#448AFF',
      accentGlow: 'hover:shadow-[0_0_12px_rgba(68,138,255,0.15)]'
    },
    monochrome: {
      container: 'bg-[#121212] border border-[#222222] hover:border-zinc-500',
      iconColor: '#FFFFFF',
      accentGlow: 'hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
    },
    stealth: {
      container: 'bg-[#181818] border border-[#282828] hover:border-zinc-600',
      iconColor: '#A1A1AA',
      accentGlow: ''
    },
    cyber_neon: {
      container: 'bg-[#0a0f18] border border-[#1e293b] hover:border-cyan-400/70',
      iconColor: '#22d3ee',
      accentGlow: 'hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]'
    }
  }[iconPack];

  return (
    <div
      className={`${sizeClasses} ${roundedClass} ${packStyles.container} ${packStyles.accentGlow} flex items-center justify-center transition-all duration-200 active:scale-95 group-hover:scale-105 shrink-0`}
    >
      <IconComponent
        size={iconSizes}
        strokeWidth={2}
        color={packStyles.iconColor}
        className="transition-transform duration-200 group-hover:scale-110"
      />
    </div>
  );
};
