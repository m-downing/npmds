'use client';

import React, { useState, useEffect } from 'react';

interface CheckboxFilterProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  label,
  value,
  onChange,
  description,
  className = '',
  disabled = false,
  error,
  size = 'md',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          checkbox: 'w-4 h-4',
          label: 'text-sm',
          description: 'text-xs',
        };
      case 'lg':
        return {
          checkbox: 'w-6 h-6',
          label: 'text-lg',
          description: 'text-sm',
        };
      default:
        return {
          checkbox: 'w-5 h-5',
          label: 'text-base',
          description: 'text-sm',
        };
    }
  };

  const getCheckboxClasses = () => {
    const baseClasses = `
      w-4 h-4 rounded-sm border-2 transition-colors duration-200 
      focus:outline-none focus:ring-2 focus:ring-opacity-30 cursor-pointer
    `;
    
    if (disabled) {
      return `${baseClasses} bg-neutral-100 border-neutral-300 cursor-not-allowed dark:bg-neutral-900 dark:border-neutral-700`;
    }
    
    if (error) {
      return `${baseClasses} border-error-500 focus:ring-error-500 ${value ? 'bg-error-600' : 'bg-white dark:bg-neutral-900'}`;
    }
    
    if (value) {
      return `${baseClasses} bg-neutral-600 border-neutral-600 focus:ring-neutral-600 dark:bg-neutral-600 dark:border-neutral-600 dark:focus:ring-neutral-400`;
    }
    
    return `${baseClasses} bg-white border-neutral-300 hover:border-neutral-500 focus:ring-neutral-600 dark:bg-neutral-900 dark:border-neutral-600 dark:hover:border-neutral-500 dark:focus:ring-neutral-400`;
  };

  const getLabelClasses = () => {
    const baseClasses = `
      text-sm transition-colors duration-200 cursor-pointer select-none
    `;
    
    if (disabled) {
      return `${baseClasses} text-neutral-400 dark:text-neutral-500`;
    }
    
    return `${baseClasses} text-neutral-900 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-50`;
  };

  const getDescriptionClasses = () => {
    const baseClasses = `
      text-xs transition-colors duration-200
    `;
    
    if (disabled) {
      return `${baseClasses} text-neutral-400 dark:text-neutral-600`;
    }
    
    return `${baseClasses} text-neutral-600 dark:text-neutral-300`;
  };

  const getContainerClasses = () => {
    const baseClasses = `
      flex items-start space-x-3 p-2 rounded-sm transition-colors duration-200
    `;
    
    if (disabled) {
      return `${baseClasses} cursor-not-allowed`;
    }
    
    return `${baseClasses} hover:bg-neutral-50 dark:hover:bg-neutral-800`;
  };

  return (
    <div className={`${className}`}>
      <div className={getContainerClasses()}>
        <div className="flex items-center h-6">
          <input
            type="checkbox"
            checked={value}
            onChange={handleChange}
            disabled={disabled}
            className={getCheckboxClasses()}
            aria-describedby={description ? `${label}-description` : undefined}
          />
          
          {/* Custom checkmark icon */}
          {value && (
            <div className={`absolute pointer-events-none ${getSizeClasses().checkbox} flex items-center justify-center`}>
              <svg 
                className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-white`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <label 
            htmlFor={label}
            className={getLabelClasses()}
          >
            {label}
          </label>
          
          {description && (
            <p 
              id={`${label}-description`}
              className={getDescriptionClasses()}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-error-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default CheckboxFilter; 