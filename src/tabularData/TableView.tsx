import React, { useState, useMemo, useRef } from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { TableViewProps, SortConfig, FilterConfig } from './types';
import { filterData, sortData, paginateData, getVisibleColumns, getModeConstraints, openTableInNewTab } from './utils';
import { colors } from '../foundations/tokens/colors';
import { getTypography } from '../foundations/tokens/typography';
import TableToggle from '../components/controls/TableToggle';

export const TableView = <T extends Record<string, unknown>>({
  data,
  columns,
  mode = 'deepDive',
  title,
  tableId,
  loading = false,
  emptyState = <p>No data available.</p>,
  onRowClick,
  onSort,
  filters = [],
  sortConfig,
  height = 400,
  width,
  showPagination,
  pageSize = 25,
  currentPage = 1,
  onPageChange,
  onModeChange,
  showModeToggle = true,
}: TableViewProps<T>) => {
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Ensure initial page size matches one of the dropdown options
  const validPageSizes = [25, 50, 100];
  const initialPageSize = validPageSizes.includes(pageSize) ? pageSize : 25;
  
  // Local state management
  const [localMode, setLocalMode] = useState(mode);
  const [localSortConfig, setLocalSortConfig] = useState<SortConfig | null>(sortConfig || null);
  const [localFilters] = useState<FilterConfig[]>(filters);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [localPageSize, setLocalPageSize] = useState(initialPageSize);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map(col => col.id));
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Add this helper function after the state declarations
  const getColumnWidth = (columnId: string, column: typeof visibleColumns[0]) => {
    return columnWidths[columnId] || column.width || 150; // Default to 150px instead of 'auto'
  };

  // Get mode constraints
  const currentMode = localMode;
  const constraints = getModeConstraints(currentMode);
  const visibleColumns = getVisibleColumns(columns, currentMode);
  
  // Apply column order to visible columns
  const orderedVisibleColumns = useMemo(() => {
    return columnOrder
      .map(id => visibleColumns.find(col => col.id === id))
      .filter(col => col !== undefined) as typeof visibleColumns;
  }, [visibleColumns, columnOrder]);
  
  // Calculate pagination - only for deep dive mode with explicit pagination
  const showActualPagination = showPagination !== undefined ? showPagination : constraints.showPagination;

  // Calculate total pages
  const filteredDataLength = useMemo(() => {
    return filterData(data, localFilters).length;
  }, [data, localFilters]);

  const totalPages = Math.ceil(filteredDataLength / localPageSize);

  // Process data
  const processedData = useMemo(() => {
    let result = data;
    
    // Apply filters
    result = filterData(result, localFilters);
    
    // Apply sorting
    result = sortData(result, localSortConfig);
    
    // Apply pagination only if explicitly using pagination (not for mode constraints)
    if (showActualPagination) {
      result = paginateData(result, localCurrentPage, localPageSize);
    }
    
    return result;
  }, [data, localFilters, localSortConfig, localCurrentPage, localPageSize, showActualPagination]);

  // Handle mode change
  const handleModeChange = (newMode: 'summary' | 'drilldown' | 'deepDive') => {
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
        title: title || 'Table',
        data,
        columns,
        filters: localFilters,
        sortConfig: localSortConfig,
      };
      openTableInNewTab(tableId, tableData);
    }
  };

  // Handle sorting
  const handleSort = (columnId: string) => {
    // Don't sort if we just finished resizing
    if (isResizing) {
      return;
    }
    
    const newSortConfig: SortConfig = {
      column: columnId,
      direction: localSortConfig?.column === columnId && localSortConfig.direction === 'asc' ? 'desc' : 'asc',
    };
    
    setLocalSortConfig(newSortConfig);
    if (onSort) {
      onSort(newSortConfig);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, columnId: string) => {
    setResizingColumn(columnId);
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = getColumnWidth(columnId, visibleColumns.find(col => col.id === columnId)!);
    
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + (e.clientX - startX));
      setColumnWidths(prev => ({
        ...prev,
        [columnId]: newWidth,
      }));
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      
      // Force table repaint to fix border rendering issues
      if (tableRef.current) {
        const scrollContainer = tableRef.current.querySelector('div[style*="overflow"]') as HTMLElement;
        const table = tableRef.current.querySelector('table');
        
        if (table && scrollContainer) {
          // Save current scroll position
          const scrollLeft = scrollContainer.scrollLeft;
          const scrollTop = scrollContainer.scrollTop;
          
          // Force repaint
          table.style.display = 'none';
          void table.offsetHeight; // This line forces a reflow
          table.style.display = '';
          
          // Restore scroll position
          scrollContainer.scrollLeft = scrollLeft;
          scrollContainer.scrollTop = scrollTop;
        }
      }
      
      // Reset isResizing after a short delay to ensure click event has been processed
      setTimeout(() => {
        setIsResizing(false);
      }, 100);
    };
    
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Column drag and drop handlers
  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    // Add a visual effect
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedColumn(null);
    setDragOverColumn(null);
    // Remove visual effect
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(targetColumnId);

    // Remove dragged column
    newOrder.splice(draggedIndex, 1);
    // Insert at new position
    newOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    setDragOverColumn(null);
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

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
    tableLayout: 'fixed',
  };

  const getThStyle = (columnId: string): React.CSSProperties => ({
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    position: 'relative',
    userSelect: 'none',
    zIndex: 10,
    cursor: constraints.showColumnReorder ? 'grab' : 'pointer',
    transition: 'border-color 0.2s',
    borderLeft: dragOverColumn === columnId ? `3px solid ${colors.primary[500]}` : undefined,
    boxSizing: 'border-box',
  });

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    boxSizing: 'border-box',
  };

  const rowStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    cursor: onRowClick ? 'pointer' : 'default',
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
      ref={tableRef}
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
          <TableToggle
            mode={currentMode}
            onChange={handleModeChange}
            showDeepDive={!!tableId}
            onDeepDiveExternal={handleDeepDiveExternal}
          />
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto relative">
        <table style={tableStyle}>
          <thead>
            <tr>
              {orderedVisibleColumns.map((column) => (
                <th
                  key={column.id}
                  style={{
                    ...getThStyle(column.id),
                    width: getColumnWidth(column.id, column),
                    minWidth: column.minWidth || 100,
                    maxWidth: column.maxWidth || 'none',
                    position: 'sticky',
                    top: 0,
                  }}
                  className="bg-neutral-100 text-neutral-700 border-b border-r border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                  onClick={() => column.sortable !== false && handleSort(column.id)}
                  draggable={constraints.showColumnReorder}
                  onDragStart={(e) => constraints.showColumnReorder && handleDragStart(e, column.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    pointerEvents: 'none',
                  }}>
                    <span>{column.header}</span>
                    {column.sortable !== false && localSortConfig?.column === column.id && (
                      <span style={{ marginLeft: '8px' }}>
                        {localSortConfig.direction === 'asc' ? (
                          <ChevronUpIcon style={{ width: '14px', height: '14px' }} />
                        ) : (
                          <ChevronDownIcon style={{ width: '14px', height: '14px' }} />
                        )}
                      </span>
                    )}
                  </div>
                  
                  {/* Column resizer */}
                  {constraints.showColumnResize && column.resizable !== false && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -3, // Position it centered on the border
                        top: 0,
                        bottom: 0,
                        width: '10px', // Wider area for easier grabbing
                        cursor: 'col-resize',
                        backgroundColor: 'transparent',
                        zIndex: 20, // Higher z-index to ensure it's on top
                        padding: '0 2px', // Add padding for easier interaction
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation(); // Prevent triggering column drag
                        handleMouseDown(e, column.id);
                      }}
                      onDragStart={(e) => {
                        e.preventDefault(); // Prevent this element from being draggable
                        e.stopPropagation();
                      }}
                    >
                      <div
                        style={{
                          width: '2px',
                          height: '100%',
                          backgroundColor: resizingColumn === column.id ? colors.primary[500] : 'transparent',
                          margin: '0 auto',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = (colors.primary?.[400] as string) || (colors.primary?.[500] as string) || '#3B82F6';                        }}
                        onMouseLeave={(e) => {
                          if (resizingColumn !== column.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, index) => (
              <tr
                key={index}
                style={rowStyle}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => onRowClick && onRowClick(row, index)}
              >
                {orderedVisibleColumns.map((column) => (
                  <td 
                    key={column.id} 
                    style={{
                      ...tdStyle,
                      width: getColumnWidth(column.id, column),
                    }}
                    className="border-b border-r border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    {column.cell 
                      ? column.cell(row[column.accessorKey as keyof T], row, index)
                      : String(row[column.accessorKey as keyof T] || '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showActualPagination && (
        <div className="border-t border-neutral-200 p-3 flex justify-between items-center bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-neutral-600 text-sm dark:text-neutral-300">
            Showing {((localCurrentPage - 1) * localPageSize) + 1} - {Math.min(localCurrentPage * localPageSize, filteredDataLength)} of {filteredDataLength} rows
          </span>
          <div className="flex gap-2 items-center">
            {/* Page size selector */}
            <div className="flex items-center gap-2 mr-4">
              <label className="text-neutral-600 text-sm dark:text-neutral-300">
                Rows per page:
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
