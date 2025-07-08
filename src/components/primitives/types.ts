import { ButtonHTMLAttributes } from 'react';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button variant (appearance) */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Additional class names to apply */
  className?: string;
  /** Button content */
  children: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Show loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
} 