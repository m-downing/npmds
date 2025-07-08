'use client';

import React, { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';

/**
 * Input sizes
 */
type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input props
 * @interface InputProps
 * @extends {Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>}
 */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Error message to display below the input */
  error?: string;
  /** Input size */
  size?: InputSize;
  /** Left icon or element */
  leftElement?: React.ReactNode;
  /** Right icon or element */
  rightElement?: React.ReactNode;
  /** Additional class names to apply to the input container */
  containerClassName?: string;
  /** Additional class names to apply to the input element */
  className?: string;
  /** Whether the input should fill its container */
  fullWidth?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      leftElement,
      rightElement,
      containerClassName = '',
      className = '',
      fullWidth = false,
      disabled = false,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a random id if not provided
    const [inputId, setInputId] = useState(id || '');
    
    // Generate ID only on client side to avoid hydration mismatch
    useEffect(() => {
      if (!id) {
        setInputId(`input-${Math.random().toString(36).substring(2, 9)}`);
      }
    }, [id]);
    
    // Container classes
    const containerClasses = `
      ${fullWidth ? 'w-full' : ''}
      ${containerClassName}
    `;
    
    // Input size classes
    const sizeClasses = {
      sm: 'py-1.5 text-sm',
      md: 'py-2 text-base',
      lg: 'py-2.5 text-lg',
    };
    
    // Input classes with dark mode support using Tailwind dark: classes
    const getInputClasses = () => {
      const baseClasses = `
        block w-full rounded-sm border px-3
        focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-30
        transition-colors duration-200
      `;
      
      if (disabled) {
        return `${baseClasses} bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-500`;
      }
      
      if (error) {
        return `${baseClasses} bg-white border-error-500 text-neutral-900 placeholder-neutral-500 focus:border-error-500 focus-visible:ring-error-500 dark:bg-neutral-900 dark:border-error-500 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-error-500 dark:focus-visible:ring-error-500`;
      }
      
      return `${baseClasses} bg-white border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-neutral-600 focus-visible:ring-neutral-600 dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400 dark:focus:border-neutral-400 dark:focus-visible:ring-neutral-400`;
    };
    
    // Label classes with dark mode support
    const getLabelClasses = () => {
      return 'text-neutral-900 dark:text-neutral-100';
    };
    
    // Icon classes with dark mode support
    const iconClasses = 'text-neutral-500 dark:text-primary-400';
    
    // Helper text classes with dark mode support
    const getHintClasses = () => {
      return 'text-neutral-600 dark:text-neutral-400';
    };
    
    // Left/right element padding adjustment
    const leftPadding = leftElement ? 'pl-9' : '';
    const rightPadding = rightElement ? 'pr-9' : '';
    
    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`mb-1.5 block text-sm font-medium ${getLabelClasses()}`}
          >
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}
        
        {/* Input wrapper with relative positioning for icons */}
        <div className="relative">
          {/* Left element or icon */}
          {leftElement && (
            <div className={`absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none ${iconClasses}`}>
              {leftElement}
            </div>
          )}
          
          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`
              ${getInputClasses()}
              ${sizeClasses[size]}
              ${leftPadding}
              ${rightPadding}
              ${className}
            `}
            required={required}
            {...props}
          />
          
          {/* Right element or icon */}
          {rightElement && (
            <div className={`absolute right-0 inset-y-0 flex items-center pr-3 pointer-events-none ${iconClasses}`}>
              {rightElement}
            </div>
          )}
        </div>
        
        {/* Helper text or error message */}
        {(error || helperText) && (
          <div
            id={error ? `${inputId}-error` : `${inputId}-helper`}
            className={`mt-1 text-sm ${error ? 'text-error-500' : getHintClasses()}`}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 