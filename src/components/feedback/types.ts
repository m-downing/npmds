import React from 'react';

/**
 * NotificationBadge component props
 */
export interface NotificationBadgeProps {
  count: number;
  variant?: 'sm' | 'md';
  className?: string;
}

/**
 * CriticalBanner component props
 */
export interface CriticalBannerProps {
  /** Banner title text */
  title?: string;
  /** Banner message content */
  message: React.ReactNode;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
  /** Custom icon (defaults to warning triangle) */
  icon?: React.ReactNode;
  /** Whether the banner should be visible */
  isVisible?: boolean;
}

/**
 * InfoBanner component props
 */
export interface InfoBannerProps {
  /** Unique identifier for the banner - used for dismissal persistence */
  id: string;
  /** Banner title text */
  title?: string;
  /** Banner message content */
  message: React.ReactNode;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
  /** Custom icon (defaults to info icon) */
  icon?: React.ReactNode;
  /** Whether the banner should be visible */
  isVisible?: boolean;
} 