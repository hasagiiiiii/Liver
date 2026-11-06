import { TemplateRef } from '@angular/core';

export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
  field: string;
  direction: SortDirection;
}

export interface TableLazyLoadEvent {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: SortDirection;
  searchKeyword?: string;
  filterValue?: string;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sticky?: 'left' | 'right';
  templateName?: string;
  template?: TemplateRef<any>;
  pipe?: 'currency' | 'date' | 'none';
  headerClass?: string;
  cellClass?: string | ((row: T) => string);
}

export interface TableFilterOption {
  label: string;
  value: string;
}

export interface TableAction<T = any> {
  id: string;
  label: string;
  icon?: string;
  colorClass?: string;
  tooltip?: string;
  onClick: (row: T) => void;
  visible?: (row: T) => boolean;
}
