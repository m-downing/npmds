import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip positions
 */
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * Tooltip component props
 */
export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Element to trigger the tooltip */
  children: ReactNode;
  /** Tooltip position */
  position?: TooltipPosition;
  /** Whether to show an arrow pointing to the trigger element */
  arrow?: boolean;
  /** Tooltip width (overrides auto) */
  width?: string;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Additional class names */
  className?: string;
  /** Disable tooltip */
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  arrow = true,
  width = 'auto',
  delay = 300,
  className = '',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tooltip classes with dark mode support using Tailwind dark: classes
  const tooltipClasses = 'bg-neutral-900 text-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:border dark:border-neutral-700';

  // Calculate tooltip positioning styles for portal
  const getPortalTooltipStyle = (): React.CSSProperties => {
    if (!triggerRef.current) return {};
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    // Apply explicit width or allow content to size naturally
    if (width !== 'auto') {
      styles.width = width;
    } else {
      styles.minWidth = 'max-content';
    }

    switch (position) {
      case 'top':
        styles.bottom = window.innerHeight - triggerRect.top + 4;
        styles.left = triggerRect.left + triggerRect.width / 2;
        styles.transform = 'translateX(-50%)';
        break;
      case 'right':
        styles.left = triggerRect.right + 4;
        styles.top = triggerRect.top + triggerRect.height / 2;
        styles.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        styles.top = triggerRect.bottom + 4;
        styles.left = triggerRect.left + triggerRect.width / 2;
        styles.transform = 'translateX(-50%)';
        break;
      case 'left':
        styles.right = window.innerWidth - triggerRect.left + 4;
        styles.top = triggerRect.top + triggerRect.height / 2;
        styles.transform = 'translateY(-50%)';
        break;
    }

    return styles;
  };

  // Calculate tooltip positioning styles for regular positioning
  const getTooltipStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    // Apply explicit width or allow content to size naturally
    if (width !== 'auto') {
      styles.width = width;
    } else {
      styles.minWidth = 'max-content';
    }

    switch (position) {
      case 'top':
        styles.bottom = '100%';
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        styles.marginBottom = '4px';
        break;
      case 'right':
        styles.left = '100%';
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        styles.marginLeft = '4px';
        break;
      case 'bottom':
        styles.top = '100%';
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        styles.marginTop = '4px';
        break;
      case 'left':
        styles.right = '100%';
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        styles.marginRight = '4px';
        break;
    }

    return styles;
  };

  // Arrow positioning classes
  const arrowPositionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45',
  };

  // Arrow classes with dark mode support
  const arrowClasses = 'bg-neutral-900 dark:bg-neutral-800 dark:border-neutral-700';

  // Show tooltip after delay
  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  // Hide tooltip immediately
  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsVisible(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  // Use portal for "right" positioned tooltips to avoid clipping by sidebar
  const usePortal = position === 'right' && isClient;

  const tooltipElement = isVisible && !disabled && (
    <div
      role="tooltip"
      ref={tooltipRef}
      className={
        `${usePortal ? '' : 'absolute'} rounded-sm px-2 py-1 text-sm shadow-md break-words ${width === 'auto' ? 'min-w-max' : ''} ${tooltipClasses}`
      }
      style={usePortal ? getPortalTooltipStyle() : { ...getTooltipStyle(), zIndex: 9999 }}
    >
      {content}
      {arrow && (
        <div
          className={`absolute h-2 w-2 ${arrowClasses} ${arrowPositionClasses[position]}`}  
        />
      )}
    </div>
  );

  return (
    <div
      className={`relative ${className || 'inline-block'}`}
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {/* Render tooltip via portal if using portal, otherwise render normally */}
      {usePortal && isClient ? (
        createPortal(tooltipElement, document.body)
      ) : (
        tooltipElement
      )}
    </div>
  );
};

export default Tooltip;
