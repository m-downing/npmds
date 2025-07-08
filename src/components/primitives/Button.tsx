'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Button variants
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Button sizes
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 * @interface ButtonProps
 * @extends {ButtonHTMLAttributes<HTMLButtonElement>}
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Common classes for all button variants with dark mode support
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50 dark:focus-visible:ring-primary-300';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes with dark mode support using Tailwind dark: classes
  const getVariantClasses = (variantType: ButtonVariant): string => {
    switch (variantType) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-neutral-50 shadow-sm dark:bg-primary-500 dark:hover:bg-primary-400';
      case 'secondary':
        return 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 border border-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-100 dark:border-neutral-600';
      case 'outline':
        return 'border border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-900 dark:hover:text-primary-200';
      case 'ghost':
        return 'text-primary-600 hover:bg-primary-50 hover:text-primary-700 dark:text-primary-300 dark:hover:bg-primary-900 dark:hover:text-primary-200';
      case 'danger':
        return 'bg-error-500 hover:bg-error-300 text-neutral-50 shadow-sm dark:bg-error-500 dark:hover:bg-error-300';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-neutral-50 shadow-sm dark:bg-primary-500 dark:hover:bg-primary-400';
    }
  };
  
  // Loading styles
  const loadingClasses = isLoading 
    ? 'cursor-wait opacity-80' 
    : '';
  
  // Disabled styles
  const disabledClasses = disabled
    ? 'opacity-60 cursor-not-allowed pointer-events-none'
    : '';
  
  // Full width styles
  const widthClasses = fullWidth
    ? 'w-full'
    : '';
  
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${getVariantClasses(variant)}
        ${loadingClasses}
        ${disabledClasses}
        ${widthClasses}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 