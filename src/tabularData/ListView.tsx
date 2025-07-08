'use client';

import React, { useState, useMemo } from 'react';
import { ListViewProps } from './types';
import { openTableInNewTab, paginateData } from './utils';
import { getTypography } from '../foundations/tokens/typography';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

export const ListView = <T extends Record<string, unknown>>({
  data,
  mode = 'deepDive',
  title,
  tableId,
  loading = false,
  emptyState = <p>No data available.</p>,
  renderItem,
  onItemClick,
  height = 400,
  width,
  onModeChange,
  showModeToggle = true,
  showPagination,
  pageSize = 25,
  currentPage = 1,
  onPageChange,
}: ListViewProps<T>) => {
  
  // Ensure initial page size matches one of the dropdown options
  const validPageSizes = [25, 50, 100];
  const initialPageSize = validPageSizes.includes(pageSize) ? pageSize : 25;
  
  // Local state management
  const [localMode, setLocalMode] = useState(mode);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [localPageSize, setLocalPageSize] = useState(initialPageSize);
  
  // Get mode constraints
  const currentMode = localMode;
  
  // Calculate pagination
  const showActualPagination = showPagination !== undefined ? showPagination : true;
  
  // Calculate total pages
  const totalPages = Math.ceil(data.length / localPageSize);
  
  // Process data based on mode
  const processedData = useMemo(() => {
    let result = data;
    
    // Apply pagination if enabled
    if (showActualPagination) {
      result = paginateData(result, localCurrentPage, localPageSize);
    }
    
    return result;
  }, [data, localCurrentPage, localPageSize, showActualPagination]);

  // Handle mode change
  const handleModeChange = (newMode: 'summary' | 'drilldown' | 'deepDive') => {
    // ListView only supports summary and deepDive modes
    if (newMode === 'drilldown') {
      // If drilldown is requested, treat it as deepDive for ListView
      newMode = 'deepDive';
    }
    
    if (newMode === 'deepDive' && tableId) {
      // Don't change local mode for deep dive, just trigger external navigation
      return;
    }
    
    setLocalMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  // Handle deep dive external navigation
  const handleDeepDiveExternal = () => {
    if (tableId) {
      const tableData = {
        title: title || 'List',
        data,
        renderItem,
      };
      openTableInNewTab(tableId, tableData);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setLocalCurrentPage(page);
      if (onPageChange) {
        onPageChange(page);
      }
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setLocalPageSize(newPageSize);
    // Reset to first page when page size changes to avoid being on an invalid page
    setLocalCurrentPage(1);
    if (onPageChange) {
      onPageChange(1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (localCurrentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, localCurrentPage - 1);
      const end = Math.min(totalPages - 1, localCurrentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (localCurrentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Styling with Tailwind dark: classes
  const containerStyle: React.CSSProperties = {
    width: width || '100%',
    height: currentMode === 'deepDive' ? '100%' : height,
    fontFamily: getTypography.fontFamily('body'),
  };

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  };

  const listContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
  };

  const itemStyle: React.CSSProperties = {
    padding: '12px 16px',
    cursor: onItemClick ? 'pointer' : 'default',
  };

  if (loading) {
    return (
      <div 
        style={containerStyle}
        className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex flex-col dark:bg-neutral-900 dark:border-neutral-700"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        style={containerStyle}
        className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex flex-col dark:bg-neutral-900 dark:border-neutral-700"
      >
        <div className="flex items-center justify-center h-full">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div 
      style={containerStyle}
      className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden flex flex-col dark:bg-neutral-900 dark:border-neutral-700"
    >
      {/* Header */}
      <div 
        style={headerStyle}
        className="bg-neutral-100 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
      >
        <h3 
          style={titleStyle}
          className="text-neutral-900 dark:text-neutral-50"
        >
          {title}
        </h3>
        {showModeToggle && (
          <div>
            {/* Mode toggle component will be added here if needed */}
          </div>
        )}
      </div>

      {/* List Container */}
      <div style={listContainerStyle}>
        {processedData.map((item, index) => (
          <div
            key={index}
            style={itemStyle}
            className="border-b border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => onItemClick && onItemClick(item, index)}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showActualPagination && (
        <div className="border-t border-neutral-200 p-3 flex justify-between items-center bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-neutral-600 text-sm dark:text-neutral-300">
            Showing {((localCurrentPage - 1) * localPageSize) + 1} - {Math.min(localCurrentPage * localPageSize, data.length)} of {data.length} items
          </span>
          <div className="flex gap-2 items-center">
            {/* Page size selector */}
            <div className="flex items-center gap-2 mr-4">
              <label className="text-neutral-600 text-sm dark:text-neutral-300">
                Items per page:
              </label>
              <select
                value={localPageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="bg-neutral-50 text-neutral-700 border border-neutral-300 rounded px-2 py-1 text-sm cursor-pointer min-w-[60px] dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* First page button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={localCurrentPage === 1}
              className="p-1 bg-transparent border border-neutral-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-neutral-700 flex items-center justify-center min-w-[32px] h-[32px] dark:border-neutral-600 dark:text-neutral-300"
              title="First page"
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </button>

            {/* Previous page button */}
            <button
              onClick={() => handlePageChange(localCurrentPage - 1)}
              disabled={localCurrentPage === 1}
              className="p-1 bg-transparent border border-neutral-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-neutral-700 flex items-center justify-center min-w-[32px] h-[32px] dark:border-neutral-600 dark:text-neutral-300"
              title="Previous page"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-neutral-600 dark:text-neutral-400">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page as number)}
                    className={`px-2 py-1 text-sm border border-neutral-300 rounded cursor-pointer min-w-[32px] h-[32px] flex items-center justify-center dark:border-neutral-600 ${
                      localCurrentPage === page
                        ? 'bg-neutral-700 text-white dark:bg-neutral-600'
                        : 'bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Next page button */}
            <button
              onClick={() => handlePageChange(localCurrentPage + 1)}
              disabled={localCurrentPage === totalPages}
              className="p-1 bg-transparent border border-neutral-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-neutral-700 flex items-center justify-center min-w-[32px] h-[32px] dark:border-neutral-600 dark:text-neutral-300"
              title="Next page"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>

            {/* Last page button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={localCurrentPage === totalPages}
              className="p-1 bg-transparent border border-neutral-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-neutral-700 flex items-center justify-center min-w-[32px] h-[32px] dark:border-neutral-600 dark:text-neutral-300"
              title="Last page"
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
