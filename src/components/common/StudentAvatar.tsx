import React, { useState } from 'react';

interface StudentAvatarProps {
  name: string;
  studentId: string;
  photoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Deterministic dummy avatar based on student name / ID using dicebear or unavatar
export function getDummyAvatar(name: string, studentId: string): string {
  const seed = encodeURIComponent(`${studentId}-${name.toLowerCase().trim()}`);
  // DiceBear thumbs / bottts style or adventurer
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  studentId,
  photoUrl,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] rounded-lg',
    sm: 'w-8 h-8 text-xs rounded-xl',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-12 h-12 text-base rounded-2xl',
    xl: 'w-16 h-16 text-xl rounded-2xl',
  }[size];

  // Use real photoUrl if provided, otherwise fallback to high quality deterministic dummy avatar
  const targetSrc = photoUrl && !hasError ? photoUrl : getDummyAvatar(name, studentId);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || name.slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative overflow-hidden flex-shrink-0 bg-gradient-to-tr from-stone-900 to-stone-800 text-white font-mono font-bold flex items-center justify-center shadow-sm select-none border border-stone-200/80 ${sizeClasses} ${className}`}
    >
      <img
        src={targetSrc}
        alt={name}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover rounded-[inherit] transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      {hasError && !targetSrc && (
        <span className="font-mono tracking-tight">{initials}</span>
      )}
    </div>
  );
};
