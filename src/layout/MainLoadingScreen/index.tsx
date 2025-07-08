import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center z-[1000] backdrop-blur-sm bg-neutral-50/80 dark:bg-neutral-950/80 ${className}`}>
      <div className="text-center w-[400px] h-[300px] p-12 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-[3px] border-neutral-300 dark:border-neutral-500 border-t-primary-500 dark:border-t-neutral-50 rounded-full animate-spin"></div>
          </div>
          <p className="text-neutral-900 dark:text-neutral-50 font-semibold text-lg m-0">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

// Keep the old export for backward compatibility
export default LoadingSpinner;