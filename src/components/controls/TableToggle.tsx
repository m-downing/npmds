import React from 'react';
import clsx from 'clsx';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

// Define the DetailLevel type for table views
type DetailLevel = 'summary' | 'drilldown' | 'deepDive';

export interface TableToggleProps {
  mode: DetailLevel;
  onChange: (mode: DetailLevel) => void;
  showDeepDive?: boolean;
  showDrilldown?: boolean;
  className?: string;
  onDeepDiveExternal?: () => void;
  usePlaceholder?: boolean;
}

export const TableToggle: React.FC<TableToggleProps> = ({
  mode,
  onChange,
  showDeepDive = false,
  showDrilldown = true,
  className,
  onDeepDiveExternal,
  usePlaceholder = false,
}) => {
  // Theme-aware border classes
  const borderClasses = 'border-neutral-300 dark:border-neutral-600';

  // Handle the deep dive button click
  const handleDeepDiveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default anchor behavior
    
    // If using placeholder, don't trigger external navigation
    if (usePlaceholder) {
      return;
    }
    
    // If external handler exists, use it to open in a new tab
    if (onDeepDiveExternal) {
      onDeepDiveExternal();
    } else {
      // Default behavior - toggle mode
      onChange('deepDive');
    }
  };

  // Get button classes based on active state and theme
  const getButtonClasses = (isActive: boolean) => {
    if (isActive) {
      return 'bg-neutral-700 text-white dark:bg-neutral-700 dark:text-white';
    }
    return 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700';
  };

  const deepDiveButtonClasses = mode === 'deepDive' 
    ? 'bg-neutral-700 text-white dark:bg-neutral-700 dark:text-white' 
    : 'bg-transparent hover:bg-neutral-100 text-neutral-600 dark:hover:bg-neutral-800 dark:text-neutral-300';

  return (
    <div className={clsx('flex items-center', className)}>
      {/* Toggle buttons for Summary and Drill Down */}
      <div className={`flex rounded-md overflow-hidden border ${borderClasses}`}>
        <button
          className={clsx(
            'px-4 py-2 text-sm font-medium transition-colors',
            getButtonClasses(mode === 'summary')
          )}
          onClick={() => onChange('summary')}
        >
          Summary
        </button>
        {showDrilldown && (
          <button
            className={clsx(
              'px-4 py-2 text-sm font-medium transition-colors',
              `border-l ${borderClasses}`,
              getButtonClasses(mode === 'drilldown')
            )}
            onClick={() => onChange('drilldown')}
          >
            Drill Down
          </button>
        )}
      </div>

      {/* Deep Dive button with rocket icon */}
      {showDeepDive && (
        <a
          href="#"
          className={clsx(
            'ml-2 p-2 rounded-md transition-colors',
            deepDiveButtonClasses
          )}
          onClick={handleDeepDiveClick}
          title={usePlaceholder ? "Deep Dive (Placeholder)" : onDeepDiveExternal ? "Deep Dive (Click to open in new tab)" : "Deep Dive"}
        >
          <RocketLaunchIcon 
            className="w-7 h-7 opacity-80 hover:opacity-100 transition-opacity duration-150" 
          />
        </a>
      )}
    </div>
  );
};

export default TableToggle;
