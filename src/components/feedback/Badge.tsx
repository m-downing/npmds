// src/app/components/design-system/Badge.tsx

import React from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Badge variants for all possible status indicators in the application
 */
export type BadgeVariant = 
  // Supply Chain Status Badges - ordered by workflow progression
  | 'forecast'
  | 'forecastInverted'
  | 'sop'
  | 'sopInverted'
  | 'businessCase'
  | 'businessCaseInverted'
  | 'purchaseReq'
  | 'purchaseReqInverted'
  | 'purchaseOrder'
  | 'purchaseOrderInverted'
  | 'integrator'
  | 'integratorInverted'
  | 'networkBuild'
  | 'networkBuildInverted'
  | 'logicalBuild'
  | 'logicalBuildInverted'
  | 'completed'
  | 'completedInverted'
  | 'unassigned1'
  | 'unassigned1Inverted'
  | 'unassigned2'
  | 'unassigned2Inverted'
  // Priority/Risk Badges
  | 'critical'
  | 'highPriority'
  | 'standard'
  | 'atRisk';

/**
 * Badge icon types
 */
export type BadgeIcon = 'exclamation-triangle' | 'information-circle';

/**
 * Badge component props
 * @interface BadgeProps
 */
interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Badge variant/color */
  variant: BadgeVariant;
  /** Optional icon to display to the left of the text */
  icon?: BadgeIcon;
  /** Optional click handler */
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  /** Additional class names to apply */
  className?: string;
  /** Size of the badge - defaults to regular */
  size?: 'small' | 'regular';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  icon,
  onClick,
  className = '',
  size = 'regular',
}) => {
  // Check if it's a priority/risk badge
  const isPriorityBadge = ['critical', 'highPriority', 'standard', 'atRisk'].includes(variant);
  
  // Transform text to uppercase for priority/risk badges
  const content = isPriorityBadge ? children?.toString().toUpperCase() : children;
  
  // Size classes
  const sizeClasses = size === 'small' 
    ? 'px-1.5 py-1.5 text-xxs' 
    : 'px-2 py-1 text-xs';
  
  // Icon size classes
  const iconSizeClass = size === 'small' ? 'h-3 w-3' : 'h-4 w-4';
  
  // Spacing between icon and text
  const iconSpacing = icon ? (size === 'small' ? 'gap-1' : 'gap-1.5') : '';
  
  // Render the appropriate icon
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconProps = {
      className: iconSizeClass,
      'aria-hidden': true
    };
    
    switch (icon) {
      case 'exclamation-triangle':
        return <ExclamationTriangleIcon {...iconProps} />;
      case 'information-circle':
        return <InformationCircleIcon {...iconProps} />;
      default:
        return null;
    }
  };

  // Build variant-specific Tailwind classes
  const variantClasses = {
    // Supply Chain Status Badges - ordered by workflow progression
    forecast: 'bg-badge-forecast-bg text-badge-forecast-text',
    forecastInverted: 'bg-badge-forecastInverted-bg text-badge-forecastInverted-text border-2 border-badge-forecastInverted-border',
    sop: 'bg-badge-sop-bg text-badge-sop-text',
    sopInverted: 'bg-badge-sopInverted-bg text-badge-sopInverted-text border-2 border-badge-sopInverted-border',
    businessCase: 'bg-badge-businessCase-bg text-badge-businessCase-text',
    businessCaseInverted: 'bg-badge-businessCaseInverted-bg text-badge-businessCaseInverted-text border-2 border-badge-businessCaseInverted-border',
    purchaseReq: 'bg-badge-purchaseReq-bg text-badge-purchaseReq-text',
    purchaseReqInverted: 'bg-badge-purchaseReqInverted-bg text-badge-purchaseReqInverted-text border-2 border-badge-purchaseReqInverted-border',
    purchaseOrder: 'bg-badge-purchaseOrder-bg text-badge-purchaseOrder-text',
    purchaseOrderInverted: 'bg-badge-purchaseOrderInverted-bg text-badge-purchaseOrderInverted-text border-2 border-badge-purchaseOrderInverted-border',
    integrator: 'bg-badge-integrator-bg text-badge-integrator-text',
    integratorInverted: 'bg-badge-integratorInverted-bg text-badge-integratorInverted-text border-2 border-badge-integratorInverted-border',
    networkBuild: 'bg-badge-networkBuild-bg text-badge-networkBuild-text',
    networkBuildInverted: 'bg-badge-networkBuildInverted-bg text-badge-networkBuildInverted-text border-2 border-badge-networkBuildInverted-border',
    logicalBuild: 'bg-badge-logicalBuild-bg text-badge-logicalBuild-text',
    logicalBuildInverted: 'bg-badge-logicalBuildInverted-bg text-badge-logicalBuildInverted-text border-2 border-badge-logicalBuildInverted-border',
    completed: 'bg-badge-completed-bg text-badge-completed-text',
    completedInverted: 'bg-badge-completedInverted-bg text-badge-completedInverted-text border-2 border-badge-completedInverted-border',
    unassigned1: 'bg-badge-unassigned1-bg text-badge-unassigned1-text',
    unassigned1Inverted: 'bg-badge-unassigned1Inverted-bg text-badge-unassigned1Inverted-text border-2 border-badge-unassigned1Inverted-border',
    unassigned2: 'bg-badge-unassigned2-bg text-badge-unassigned2-text',
    unassigned2Inverted: 'bg-badge-unassigned2Inverted-bg text-badge-unassigned2Inverted-text border-2 border-badge-unassigned2Inverted-border',
    // Priority/Risk Badges
    critical: 'bg-badge-critical-bg text-badge-critical-text',
    highPriority: 'bg-badge-highPriority-bg text-badge-highPriority-text',
    standard: 'bg-badge-standard-bg text-badge-standard-text',
    atRisk: 'bg-badge-atRisk-bg text-badge-atRisk-text',
  };
  
  const variantClass = variantClasses[variant];
  
  if (!variantClass) {
    console.error(`Badge variant "${variant}" is not defined`);
    return null;
  }
  
  // Cursor class if onClick provided
  const cursorClass = onClick ? 'cursor-pointer hover:opacity-90' : '';
  
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        font-semibold
        rounded-xs
        opacity-85
        ${sizeClasses}
        ${iconSpacing}
        ${variantClass}
        ${cursorClass}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {renderIcon()}
      {content}
    </span>
  );
};

export default Badge; 