'use client';

import React from 'react';

interface NotificationBadgeProps {
  count: number;
  variant?: 'sm' | 'md';
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  variant = 'md',
  className = '' 
}) => {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'min-h-[18px] min-w-[18px] px-1 text-[10px]',
    md: 'min-h-[20px] min-w-[20px] px-1.5 text-xs'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  // Default positioning if no custom className with positioning is provided
  const defaultPositioning = className.includes('absolute') || className.includes('fixed') || className.includes('relative') 
    ? '' 
    : 'absolute -top-1 -right-1';

  return (
    <span 
      className={`
        ${defaultPositioning}
        ${sizeClasses[variant]}
        bg-error-500
        text-white
        rounded-full
        flex items-center justify-center
        font-semibold
        leading-none
        ${className}
      `}
      aria-label={`${count} unread notifications`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
