'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Input from '../forms/Input';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DatePreset {
  label: string;
  value: string;
  getRange: () => DateRange;
}

interface DateRangeFilterProps {
  label: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
  showPresets?: boolean;
  presets?: DatePreset[];
  allowSingleDate?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: [string, string];
}

// Default presets
export const DEFAULT_PRESETS: DatePreset[] = [
  {
    label: 'Today',
    value: 'today',
    getRange: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { startDate: today, endDate: today };
    },
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    getRange: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return { startDate: yesterday, endDate: yesterday };
    },
  },
  {
    label: 'Last 7 days',
    value: 'last7days',
    getRange: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'Last 30 days',
    value: 'last30days',
    getRange: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'This month',
    value: 'thismonth',
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'Last month',
    value: 'lastmonth',
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    },
  },
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label,
  value,
  onChange,
  className = '',
  disabled = false,
  error,
  showPresets = true,
  presets = DEFAULT_PRESETS,
  allowSingleDate = false,
  minDate,
  maxDate,
  placeholder = ['Start date', 'End date'],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update temp dates when value changes
    setTempStartDate(value.startDate ? formatDateForInput(value.startDate) : '');
    setTempEndDate(value.endDate ? formatDateForInput(value.endDate) : '');
    
    // Check if current value matches a preset
    const matchingPreset = presets.find(preset => {
      const presetRange = preset.getRange();
      return (
        isSameDate(presetRange.startDate, value.startDate) &&
        isSameDate(presetRange.endDate, value.endDate)
      );
    });
    
    setSelectedPreset(matchingPreset?.value || null);
  }, [value, presets]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const parseInputDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 && !date2) return true;
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  const handlePresetSelect = useCallback((preset: DatePreset) => {
    const range = preset.getRange();
    onChange(range);
    setSelectedPreset(preset.value);
    setIsOpen(false);
  }, [onChange]);

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setTempStartDate(dateStr);
    
    const startDate = parseInputDate(dateStr);
    if (startDate || !dateStr) {
      // Validate date range
      let endDate = value.endDate;
      if (startDate && endDate && startDate > endDate) {
        endDate = allowSingleDate ? null : startDate;
      }
      
      onChange({ startDate, endDate });
      setSelectedPreset(null);
    }
  }, [value.endDate, onChange, allowSingleDate]);

  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setTempEndDate(dateStr);
    
    const endDate = parseInputDate(dateStr);
    if (endDate || !dateStr) {
      // Validate date range
      let startDate = value.startDate;
      if (endDate && startDate && startDate > endDate) {
        startDate = allowSingleDate ? null : endDate;
      }
      
      onChange({ startDate, endDate });
      setSelectedPreset(null);
    }
  }, [value.startDate, onChange, allowSingleDate]);

  const handleClear = useCallback(() => {
    onChange({ startDate: null, endDate: null });
    setSelectedPreset(null);
  }, [onChange]);

  const getLabelClasses = () => {
    return 'text-neutral-900 dark:text-neutral-100';
  };

  const getContainerClasses = () => {
    const baseClasses = `
      relative w-full rounded-sm border px-3 py-2 cursor-pointer
      focus-within:outline-none focus-within:ring-2 focus-within:ring-opacity-30
      transition-colors duration-200 min-h-[2.5rem]
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
      absolute z-[99999] w-full mt-1 rounded-sm border shadow-lg overflow-hidden
    `;
    
    return `${baseClasses} bg-white border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600`;
  };

  const getPresetButtonClasses = (isActive: boolean) => {
    const baseClasses = `
      w-full text-left px-3 py-2 text-sm transition-colors duration-150
    `;
    
    if (isActive) {
      return `${baseClasses} bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100`;
    }
    
    return `${baseClasses} text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-700`;
  };

  const getSelectedTextClasses = () => {
    return 'text-neutral-900 dark:text-neutral-100';
  };

  const getPlaceholderClasses = () => {
    return 'text-neutral-500 dark:text-neutral-400';
  };

  const getDisplayText = () => {
    if (value.startDate && value.endDate) {
      if (isSameDate(value.startDate, value.endDate)) {
        return formatDisplayDate(value.startDate);
      }
      return `${formatDisplayDate(value.startDate)} - ${formatDisplayDate(value.endDate)}`;
    }
    
    if (value.startDate) {
      return `From ${formatDisplayDate(value.startDate)}`;
    }
    
    if (value.endDate) {
      return `Until ${formatDisplayDate(value.endDate)}`;
    }
    
    return null;
  };

  const displayText = getDisplayText();

  return (
    <div className={`space-y-1 ${className}`}>
      <label className={`block text-sm font-medium ${getLabelClasses()}`}>
        {label}
      </label>
      
      <div
        ref={containerRef}
        className={getContainerClasses()}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {displayText ? (
              <span className={getSelectedTextClasses()}>
                {displayText}
              </span>
            ) : (
              <span className={getPlaceholderClasses()}>
                Select date range...
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {displayText && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
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
          <div className={getDropdownClasses()}>
            <div className="p-4 space-y-4">
              {/* Date inputs */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={placeholder[0]}
                  type="date"
                  value={tempStartDate}
                  onChange={handleStartDateChange}
                  min={minDate ? formatDateForInput(minDate) : undefined}
                  max={maxDate ? formatDateForInput(maxDate) : undefined}
                  size="sm"
                />
                <Input
                  label={placeholder[1]}
                  type="date"
                  value={tempEndDate}
                  onChange={handleEndDateChange}
                  min={minDate ? formatDateForInput(minDate) : undefined}
                  max={maxDate ? formatDateForInput(maxDate) : undefined}
                  size="sm"
                />
              </div>
              
              {/* Presets */}
              {showPresets && presets.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                    Quick select
                  </div>
                  <div className="space-y-1">
                    {presets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={getPresetButtonClasses(selectedPreset === preset.value)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
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

export default DateRangeFilter; 