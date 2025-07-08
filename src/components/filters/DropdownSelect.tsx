import React, { useState, useCallback, useEffect, useRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

interface DropdownSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  searchable?: boolean;
  clearable?: boolean;
  maxHeight?: number;
  groupBy?: boolean;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
  error,
  searchable = true,
  clearable = true,
  maxHeight = 240,
  groupBy = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
  
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

  const selectedOption = options.find(opt => opt.value === value);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && searchable) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [disabled, isOpen, searchable]);

  const handleOptionSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  }, [onChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredOptions.length === 1) {
      handleOptionSelect(filteredOptions[0].value);
    }
  }, [filteredOptions, handleOptionSelect]);

  const handleBlur = useCallback(() => {
    // Delay hiding to allow for option clicks
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }, 150);
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

  const getDropdownClasses = () => {
    const baseClasses = `
      absolute z-[99999] w-full mt-1 rounded-sm border shadow-lg overflow-auto
    `;
    
    return `${baseClasses} bg-white border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600`;
  };

  const getOptionClasses = (option: SelectOption, isSelected: boolean) => {
    const baseClasses = `
      px-3 py-2 cursor-pointer transition-colors duration-150
    `;
    
    if (option.disabled) {
      return `${baseClasses} text-neutral-400 cursor-not-allowed dark:text-neutral-500`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100`;
    }
    
    return `${baseClasses} text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700`;
  };

  const getGroupHeaderClasses = () => {
    return 'px-3 py-2 text-xs font-medium text-neutral-600 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900';
  };

  const getSelectedTextClasses = () => {
    return 'text-neutral-900 dark:text-neutral-100';
  };

  const getPlaceholderClasses = () => {
    return 'text-neutral-500 dark:text-neutral-400';
  };

  const getSearchClasses = () => {
    const baseClasses = 'w-full px-3 py-2 bg-transparent outline-none border-b';
    
    return `${baseClasses} text-neutral-900 border-neutral-300 placeholder-neutral-500 dark:text-neutral-100 dark:border-neutral-700 dark:placeholder-neutral-400`;
  };

  // Group options if groupBy is enabled
  const renderOptions = () => {
    if (!groupBy) {
      return filteredOptions.map((option) => (
        <div
          key={option.value}
          className={getOptionClasses(option, option.value === value)}
          onClick={() => !option.disabled && handleOptionSelect(option.value)}
        >
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {option.description}
            </div>
          )}
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
    }, {} as Record<string, SelectOption[]>);

    return Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
      <div key={groupName}>
        <div className={getGroupHeaderClasses()}>
          {groupName}
        </div>
        {groupOptions.map((option) => (
          <div
            key={option.value}
            className={getOptionClasses(option, option.value === value)}
            onClick={() => !option.disabled && handleOptionSelect(option.value)}
          >
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {option.description}
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label className={`block text-sm font-medium ${getLabelClasses()}`}>
        {label}
      </label>
      
      <div
        ref={containerRef}
        className={getContainerClasses()}
        onClick={handleToggle}
        onBlur={handleBlur}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <span className={getSelectedTextClasses()}>
                {selectedOption.label}
              </span>
            ) : (
              <span className={getPlaceholderClasses()}>
                {placeholder}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {clearable && selectedOption && (
              <button
                type="button"
                onClick={handleClear}
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

export default DropdownSelect; 