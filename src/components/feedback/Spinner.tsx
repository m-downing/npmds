import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'light' | 'dark';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  'aria-label'?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-[2px]',
  md: 'h-5 w-5 border-[2px]',
  lg: 'h-6 w-6 border-[2.5px]',
  xl: 'h-8 w-8 border-[3px]',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'border-primary-200/30 border-t-primary-600',
  secondary: 'border-neutral-200/30 border-t-neutral-600',
  light: 'border-white/20 border-t-white',
  dark: 'border-neutral-300/30 border-t-neutral-700',
};

export default function Spinner({
  size = 'md',
  variant = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Loading',
}: SpinnerProps) {
  return (
    <div
      className={`
        animate-spin rounded-full 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${className}
      `.trim()}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
} 