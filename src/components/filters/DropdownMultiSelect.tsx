'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

interface DropdownMultiSelectProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  searchable?: boolean;
  maxSelections?: number;
  maxHeight?: number;
  groupBy?: boolean;
  showSelectAll?: boolean;
  showChips?: boolean;
}

const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select options...',
  className = '',
  disabled = false,
  error,
  searchable = true,
  maxSelections,
  maxHeight = 240,
  groupBy = false,
  showSelectAll = true,
  showChips = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<MultiSelectOption[]>(options);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchable) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [options, searchTerm, searchable]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && searchable) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [disabled, isOpen, searchable]);

  const handleOptionToggle = useCallback((optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return; // Don't add if max selections reached
      }
      onChange([...value, optionValue]);
    }
  }, [value, onChange, maxSelections]);

  const handleRemoveChip = useCallback((optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  }, [value, onChange]);

  const handleSelectAll = useCallback(() => {
    const availableOptions = filteredOptions.filter(opt => !opt.disabled);
    const newValues = [...new Set([...value, ...availableOptions.map(opt => opt.value)])];
    
    if (maxSelections) {
      onChange(newValues.slice(0, maxSelections));
    } else {
      onChange(newValues);
    }
  }, [filteredOptions, value, onChange, maxSelections]);

  const handleDeselectAll = useCallback(() => {
    const filteredValues = filteredOptions.map(opt => opt.value);
    onChange(value.filter(v => !filteredValues.includes(v)));
  }, [filteredOptions, value, onChange]);

  const handleClearAll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  }, [onChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  }, []);

  const getLabelClasses = () => {
    return 'text-neutral-900 dark:text-neutral-100';
  };

  const getContainerClasses = () => {
    const baseClasses = `
      relative w-full rounded-sm border px-3 py-2 cursor-pointer
      focus-within:outline-none focus-within:ring-2 focus-within:ring-opacity-30
      transition-colors duration-200
    `;
    
    if (disabled) {
      return `${baseClasses} bg-neutral-100 border-neutral-300 cursor-not-allowed dark:bg-neutral-900 dark:border-neutral-700`;
    }
    
    if (error) {
      return `${baseClasses} bg-white border-error-500 focus-within:border-error-500 focus-within:ring-error-500 dark:bg-neutral-800 dark:border-error-500 dark:focus-within:border-error-500 dark:focus-within:ring-error-500`;
    }
    
    return `${baseClasses} bg-white border-neutral-300 focus-within:border-neutral-600 focus-within:ring-neutral-600 dark:bg-neutral-800 dark:border-neutral-600 dark:focus-within:border-neutral-400 dark:focus-within:ring-neutral-400`;
  };

  const getChipClasses = () => {
    return 'inline-flex items-center px-2 py-1 text-xs rounded-md bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100';
  };

  const getRemoveChipClasses = () => {
    return 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200';
  };

  const getDropdownClasses = () => {
    const baseClasses = `
      absolute z-[99999] w-full mt-1 rounded-sm border shadow-lg overflow-auto
    `;
    
    return `${baseClasses} bg-white border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600`;
  };

  const getOptionClasses = (option: MultiSelectOption) => {
    const baseClasses = `
      px-3 py-2 cursor-pointer transition-colors duration-150 flex items-center space-x-2
    `;
    
    if (option.disabled) {
      return `${baseClasses} text-neutral-400 cursor-not-allowed dark:text-neutral-500`;
    }
    
    return `${baseClasses} text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700`;
  };

  const getCheckboxClasses = (isSelected: boolean, isDisabled: boolean) => {
    const baseClasses = `
      w-4 h-4 rounded border-2 transition-colors duration-200
    `;
    
    if (isDisabled) {
      return `${baseClasses} bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-neutral-600 border-neutral-600 dark:bg-neutral-500 dark:border-neutral-500`;
    }
    
    return `${baseClasses} bg-white border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600`;
  };

  const getGroupHeaderClasses = () => {
    return 'px-3 py-2 text-xs font-medium text-neutral-600 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900';
  };

  const getPlaceholderClasses = () => {
    return 'text-neutral-500 dark:text-neutral-400';
  };

  const getSearchClasses = () => {
    const baseClasses = 'w-full px-3 py-2 bg-transparent outline-none border-b';
    
    return `${baseClasses} text-neutral-900 border-neutral-300 placeholder-neutral-500 dark:text-neutral-100 dark:border-neutral-700 dark:placeholder-neutral-400`;
  };

  const getControlsClasses = () => {
    return 'px-3 py-2 border-b border-neutral-200 dark:border-neutral-700';
  };

  const getControlButtonClasses = () => {
    return 'text-xs text-neutral-600 hover:text-neutral-800 cursor-pointer dark:text-neutral-400 dark:hover:text-neutral-200';
  };

  const getControlTextClasses = () => {
    return 'text-xs text-neutral-500 dark:text-neutral-400';
  };

  const getCountClasses = () => {
    return 'text-xs text-neutral-500 dark:text-neutral-400';
  };

  // Group options if groupBy is enabled
  const renderOptions = () => {
    if (!groupBy) {
      return filteredOptions.map((option) => (
        <div
          key={option.value}
          className={getOptionClasses(option)}
          onClick={(e) => !option.disabled && handleOptionToggle(option.value, e)}
        >
          <div className={getCheckboxClasses(value.includes(option.value), !!option.disabled)}>
            {value.includes(option.value) && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {option.description}
              </div>
            )}
          </div>
        </div>
      ));
    }

    // Group options by group property
    const groupedOptions = filteredOptions.reduce((groups, option) => {
      const group = option.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    }, {} as Record<string, MultiSelectOption[]>);

    return Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
      <div key={groupName}>
        <div className={getGroupHeaderClasses()}>
          {groupName}
        </div>
        {groupOptions.map((option) => (
          <div
            key={option.value}
            className={getOptionClasses(option)}
            onClick={(e) => !option.disabled && handleOptionToggle(option.value, e)}
          >
            <div className={getCheckboxClasses(value.includes(option.value), !!option.disabled)}>
              {value.includes(option.value) && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label className={`block text-sm font-medium ${getLabelClasses()}`}>
        {label}
        {maxSelections && (
          <span className={`ml-2 ${getCountClasses()}`}>
            ({value.length}/{maxSelections})
          </span>
        )}
      </label>
      
      <div
        ref={containerRef}
        className={getContainerClasses()}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {showChips && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.slice(0, 3).map((option) => (
                  <span key={option.value} className={getChipClasses()}>
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveChip(option.value, e)}
                      className={`ml-1 ${getRemoveChipClasses()}`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedOptions.length > 3 && (
                  <span className={getChipClasses()}>
                    +{selectedOptions.length - 3} more
                  </span>
                )}
              </div>
            ) : selectedOptions.length > 0 ? (
              <span className="text-neutral-900 dark:text-neutral-100">
                {selectedOptions.length} selected
              </span>
            ) : (
              <span className={getPlaceholderClasses()}>
                {placeholder}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-neutral-400 dark:text-neutral-500`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isOpen && (
          <div className={getDropdownClasses()} style={{ maxHeight: `${maxHeight}px` }}>
            {searchable && (
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search options..."
                className={getSearchClasses()}
              />
            )}
            
            {showSelectAll && filteredOptions.length > 0 && (
              <div className={getControlsClasses()}>
                <div className="flex justify-between items-center">
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className={getControlButtonClasses()}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className={getControlButtonClasses()}
                    >
                      Deselect All
                    </button>
                  </div>
                  <span className={getControlTextClasses()}>
                    {value.length} of {options.length} selected
                  </span>
                </div>
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-neutral-500 dark:text-neutral-400">
                  No options found
                </div>
              ) : (
                renderOptions()
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-error-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default DropdownMultiSelect; 