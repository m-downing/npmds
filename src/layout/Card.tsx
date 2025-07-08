import React from 'react';

/**
 * Card component props
 * @interface CardProps
 */
interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card title (optional) */
  title?: string;
  /** Subtitle/description text (optional) */
  subtitle?: string;
  /** Additional class names to apply */
  className?: string;
  /** Shadow level - 'md' for main cards, 'sm' for nested cards */
  shadowLevel?: 'sm' | 'md' | 'none';
  /** Whether to make the card span full height */
  fullHeight?: boolean;
  /** Action element to display in header (e.g., button, icon) */
  headerAction?: React.ReactNode;
  /** Header margin bottom - mb-2 or mb-4 */
  headerSpacing?: '2' | '4';
  /** Padding size */
  padding?: '4' | '6';
  /** Border radius */
  rounded?: 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  shadowLevel = 'md',
  fullHeight = false,
  headerAction,
  headerSpacing = '2',
  padding = '4',
  rounded = 'lg',
}) => {
  // Standard card background - neutral-50 in light, neutral-900 in dark
  const backgroundClasses = 'bg-white dark:bg-neutral-900';
  
  // Shadow classes
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    none: ''
  }[shadowLevel];
  
  // Other classes
  const roundedClasses = `rounded-${rounded}`;
  const paddingClasses = `p-${padding}`;
  const heightClasses = fullHeight ? 'h-full' : '';
  
  return (
    <div 
      className={`
        ${backgroundClasses}
        ${shadowClasses}
        ${roundedClasses}
        ${paddingClasses}
        ${heightClasses}
        ${className}
      `}
    >
      {/* Header section with title and action */}
      {(title || headerAction) && (
        <div className={`flex justify-between items-center mb-${headerSpacing}`}>
          {title && (
            <h6 className="text-lg font-medium text-neutral-800 dark:text-neutral-50">
              {title}
            </h6>
          )}
          {headerAction}
        </div>
      )}
      
      {/* Subtitle/description */}
      {subtitle && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          {subtitle}
        </p>
      )}
      
      {/* Main content */}
      {children}
    </div>
  );
};

export default Card; 