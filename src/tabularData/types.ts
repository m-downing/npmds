import { ReactNode } from 'react';

export type DetailLevel = 'summary' | 'drilldown' | 'deepDive';

export interface ColumnDef<T = unknown> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (value: unknown, row: T, index: number) => ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  hidden?: boolean;
}

export interface FilterConfig {
  column: string;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: unknown;
  value2?: unknown; // For 'between' operator
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TableData<T = unknown> {
  id: string;
  title: string;
  data: T[];
  columns: ColumnDef<T>[];
  totalRows?: number; // For server-side pagination
  filters?: FilterConfig[];
  sortConfig?: SortConfig | null;
  renderItem?: (item: T, index: number) => ReactNode;
}

export interface TableViewProps<T = unknown> {
  data: T[];
  columns: ColumnDef<T>[];
  mode?: DetailLevel;
  title?: string;
  tableId?: string;
  loading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (row: T, index: number) => void;
  onSort?: (sortConfig: SortConfig) => void;
  onFilter?: (filters: FilterConfig[]) => void;
  filters?: FilterConfig[];
  sortConfig?: SortConfig | null;
  height?: number | string;
  width?: number | string;
  showPagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onModeChange?: (mode: DetailLevel) => void;
  showModeToggle?: boolean;
}

export interface ListViewProps<T = unknown> {
  data: T[];
  mode?: DetailLevel;
  title?: string;
  tableId?: string;
  loading?: boolean;
  emptyState?: ReactNode;
  renderItem: (item: T, index: number) => ReactNode;
  onItemClick?: (item: T, index: number) => void;
  height?: number | string;
  width?: number | string;
  onModeChange?: (mode: DetailLevel) => void;
  showModeToggle?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
} 