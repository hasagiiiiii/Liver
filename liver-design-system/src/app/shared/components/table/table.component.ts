import {
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyVNDPipe } from '../../pipes/currency-vnd.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import {
  SortDirection,
  TableColumn,
  TableFilterOption,
  TableSortState
} from './table.interface';

@Directive({
  selector: '[appTableCell]',
  standalone: true
})
export class TableCellDirective {
  @Input('appTableCell') name!: string;
  constructor(public template: TemplateRef<any>) {}
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe, DateFormatPipe],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-neutral-200 hover:border-liver-redBorder/60 transition-colors overflow-hidden" id="tableSection">
      <!-- Table Header & Controls Bar -->
      @if (showHeader) {
        <div class="px-6 py-4 bg-liver-black text-white flex flex-wrap items-center justify-between gap-4 border-b-2 border-liver-red">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-md bg-liver-red flex items-center justify-center text-xs">
              <i [class]="headerIcon"></i>
            </span>
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider">
                {{ title || 'Data Table' }}
              </h2>
              @if (subtitle) {
                <p class="text-[11px] text-neutral-400">
                  {{ subtitle }}
                </p>
              }
            </div>
          </div>

          <!-- Filter & Search Controls -->
          <div class="flex flex-wrap items-center gap-2.5">
            @if (enableSearch) {
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-neutral-400"></i>
                <input
                  type="text"
                  [(ngModel)]="searchKeyword"
                  (ngModelChange)="onSearchChange($event)"
                  [placeholder]="searchPlaceholder"
                  class="pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 hover:border-liver-red focus:outline-none focus:border-liver-red focus:ring-2 focus:ring-liver-red/20 w-56 transition-colors"
                />
              </div>
            }

            @if (filterOptions && filterOptions.length > 0) {
              <select
                [(ngModel)]="selectedFilter"
                (ngModelChange)="currentPage = 1"
                class="px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white hover:border-liver-red focus:outline-none focus:border-liver-red focus:ring-2 focus:ring-liver-red/20 transition-colors cursor-pointer"
              >
                @for (opt of filterOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            }

            @if (showAddButton) {
              <button
                type="button"
                (click)="handleAddClick()"
                class="px-3 py-1.5 rounded-lg bg-liver-red hover:bg-liver-redHover text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i class="fa-solid fa-plus"></i>
                <span>{{ addButtonText }}</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- Scrollable Table Viewport with Sticky Header and Left/Right Sticky Columns -->
      <div class="overflow-x-auto overflow-y-auto relative min-h-[180px]" [style.maxHeight]="maxHeight">
        <!-- Table Loading Overlay -->
        @if (loading) {
          <div
            class="table-loading-overlay absolute inset-0 bg-white/70 backdrop-blur-[1px] z-40 flex items-center justify-center transition-all duration-200"
          >
            <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-liver-black text-white shadow-2xl border border-neutral-700">
              <div class="w-5 h-5 rounded-full border-2 border-white/20 border-t-liver-red animate-spin"></div>
              <span class="text-xs font-bold tracking-wider">{{ loadingText }}</span>
            </div>
          </div>
        }

        <table class="w-full text-left border-collapse" [style.minWidth]="minWidth">
          <thead class="sticky-header bg-neutral-900 text-white text-[11px] uppercase tracking-wider select-none">
            <tr>
              @if (selectable) {
                <th class="sticky-col-left bg-neutral-900 py-3.5 px-3 w-12 text-center border-b border-neutral-800 z-30 select-none">
                  <input
                    type="checkbox"
                    [checked]="isAllSelected"
                    [indeterminate]="isPartiallySelected"
                    (change)="toggleSelectAll($event)"
                    class="w-4 h-4 rounded border-neutral-600 text-liver-red focus:ring-liver-red/30 accent-liver-red cursor-pointer"
                    title="Chọn tất cả bản ghi"
                  />
                </th>
              }
              @for (col of columns; track col.key) {
                <th
                  (click)="col.sortable ? toggleSort(col.key) : null"
                  [class.sticky-col-left]="col.sticky === 'left'"
                  [class.sticky-col-right]="col.sticky === 'right'"
                  [class.cursor-pointer]="col.sortable"
                  [class.hover:text-liver-red]="col.sortable"
                  [ngClass]="col.headerClass || ''"
                  [style.width]="col.width || null"
                  [style.minWidth]="col.minWidth || null"
                  class="bg-neutral-900 py-3.5 px-4 border-b border-neutral-800 transition-colors"
                >
                  <div
                    class="flex items-center gap-2"
                    [ngClass]="{
                      'justify-start': !col.align || col.align === 'left',
                      'justify-center': col.align === 'center',
                      'justify-end': col.align === 'right'
                    }"
                  >
                    <span>{{ col.title }}</span>
                    @if (col.sortable) {
                      <i [class]="getSortIconClass(col.key)"></i>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>

          <tbody class="divide-y divide-neutral-200 text-xs">
            @for (row of paginatedRows; track getRowId(row, $index)) {
              <tr
                (click)="onRowClick.emit(row)"
                class="group hover:bg-liver-redLight/60 transition-colors"
                [class.bg-liver-redLight/40]="isRowSelected(row)"
              >
                @if (selectable) {
                  <td
                    class="sticky-col-left bg-white group-hover:bg-liver-redLight py-3.5 px-3 text-center w-12 border-r border-neutral-100 transition-colors z-20"
                    (click)="$event.stopPropagation()"
                  >
                    <input
                      type="checkbox"
                      [checked]="isRowSelected(row)"
                      (change)="toggleRowSelection(row, $event)"
                      class="w-4 h-4 rounded border-neutral-300 text-liver-red focus:ring-liver-red/30 accent-liver-red cursor-pointer"
                    />
                  </td>
                }
                @for (col of columns; track col.key) {
                  <td
                    [class.sticky-col-left]="col.sticky === 'left'"
                    [class.sticky-col-right]="col.sticky === 'right'"
                    [ngClass]="getCellClass(col, row)"
                    class="py-3.5 px-4 transition-colors"
                    [class.bg-white]="col.sticky"
                    [class.group-hover:bg-liver-redLight]="col.sticky"
                    [class.border-r]="col.sticky === 'left'"
                    [class.border-l]="col.sticky === 'right'"
                    class="border-neutral-100"
                    [style.textAlign]="col.align || 'left'"
                  >
                    <!-- Template Resolution Priority: direct template -> directive template -> customTemplates map -> default rendering -->
                    @if (getTemplate(col)) {
                      <ng-container
                        *ngTemplateOutlet="getTemplate(col)!; context: { $implicit: row, row: row, value: getCellValue(row, col.key), index: $index }"
                      ></ng-container>
                    } @else if (col.pipe === 'currency') {
                      <span class="font-bold text-liver-black">
                        {{ getCellValue(row, col.key) | currencyVND }}
                      </span>
                    } @else if (col.pipe === 'date') {
                      <span class="text-neutral-600 font-medium">
                        {{ getCellValue(row, col.key) | dateFormat }}
                      </span>
                    } @else {
                      <span>{{ getCellValue(row, col.key) }}</span>
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns.length + (selectable ? 1 : 0)" class="py-12 text-center text-neutral-400">
                  @if (loading) {
                    <div class="inline-flex flex-col items-center justify-center gap-2.5 py-4">
                      <div class="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-liver-red animate-spin"></div>
                      <span class="text-xs font-bold text-neutral-500">{{ loadingText }}</span>
                    </div>
                  } @else {
                    <i class="fa-solid fa-box-open text-2xl mb-2 text-neutral-300"></i>
                    <p>{{ emptyText }}</p>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Table Footer with Pagination & Status -->
      @if (showPagination) {
        <div class="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div class="text-neutral-600 font-medium">
            Hiển thị
            <span class="font-bold text-liver-red">{{ filteredAndSortedRows.length }}</span>
            bản ghi
            @if (sortState.field) {
              • Sắp xếp:
              <span class="font-bold text-liver-black">
                {{ sortState.field.toUpperCase() }} ({{ sortState.direction.toUpperCase() }})
              </span>
            }
          </div>

          <div class="flex items-center gap-1">
            <span class="text-neutral-500 mr-2">
              Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              type="button"
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage <= 1"
              class="w-8 h-8 rounded-lg border border-neutral-300 bg-white text-liver-black hover:border-liver-red flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Trang trước"
            >
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
            </button>

            @for (p of visiblePages; track p) {
              <button
                type="button"
                (click)="goToPage(p)"
                [class.bg-liver-red]="p === currentPage"
                [class.border-liver-red]="p === currentPage"
                [class.text-white]="p === currentPage"
                [class.shadow-md]="p === currentPage"
                [class.shadow-liver-red/25]="p === currentPage"
                [class.bg-white]="p !== currentPage"
                [class.border-neutral-300]="p !== currentPage"
                [class.text-liver-black]="p !== currentPage"
                class="w-8 h-8 rounded-lg border font-bold flex items-center justify-center hover:border-liver-red transition-all"
              >
                {{ p }}
              </button>
            }

            <button
              type="button"
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage >= totalPages"
              class="w-8 h-8 rounded-lg border border-neutral-300 bg-white text-liver-black hover:border-liver-red flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Trang sau"
            >
              <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class TableComponent<T = any> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() loadingText = 'Đang tải dữ liệu...';
  @Input() emptyText = 'Không có bản ghi nào phù hợp với bộ lọc';
  @Input() maxHeight = '380px';
  @Input() minWidth = '1100px';

  // Header configs
  @Input() showHeader = true;
  @Input() title = 'Data Table';
  @Input() subtitle = '';
  @Input() headerIcon = 'fa-solid fa-table-columns';
  @Input() enableSearch = true;
  @Input() searchPlaceholder = 'Tìm kiếm dữ liệu...';
  @Input() searchFields: (keyof T | string)[] = [];
  @Input() filterOptions: TableFilterOption[] = [];
  @Input() filterKey: keyof T | string = 'status';

  // Add Button configs
  @Input() showAddButton = true;
  @Input() addButtonText = 'Thêm dòng';

  // Pagination configs
  @Input() showPagination = true;
  @Input() pageSize = 10;

  // Custom templates map via Input
  @Input() customTemplates: Record<string, TemplateRef<any>> = {};

  // Queries directives
  @ContentChildren(TableCellDirective) cellDirectives!: QueryList<TableCellDirective>;

  // Selection configs
  @Input() selectable = false;
  @Input() selectedRows: T[] = [];
  @Output() selectionChange = new EventEmitter<T[]>();

  // Outputs
  @Output() onAdd = new EventEmitter<void>();
  @Output() onAddRow = new EventEmitter<void>(); // Backward compatibility
  @Output() onEditRow = new EventEmitter<T>();   // Backward compatibility
  @Output() onDeleteRow = new EventEmitter<any>(); // Backward compatibility
  @Output() onSort = new EventEmitter<TableSortState>();
  @Output() onRowClick = new EventEmitter<T>();
  @Output() onSearch = new EventEmitter<string>();

  searchKeyword = '';
  selectedFilter = 'ALL';
  currentPage = 1;

  sortState: TableSortState = {
    field: '',
    direction: 'asc'
  };

  handleAddClick(): void {
    this.onAdd.emit();
    this.onAddRow.emit();
  }

  onSearchChange(keyword: string): void {
    this.currentPage = 1;
    this.onSearch.emit(keyword);
  }

  getRowId(row: any, fallbackIndex: number): string | number {
    return row?.id ?? row?.code ?? fallbackIndex;
  }

  isRowSelected(row: T): boolean {
    const id = this.getRowId(row, -1);
    return this.selectedRows.some(r => this.getRowId(r, -2) === id);
  }

  get isAllSelected(): boolean {
    const rows = this.paginatedRows;
    if (rows.length === 0) return false;
    return rows.every(r => this.isRowSelected(r));
  }

  get isPartiallySelected(): boolean {
    const rows = this.paginatedRows;
    if (rows.length === 0) return false;
    const count = rows.filter(r => this.isRowSelected(r)).length;
    return count > 0 && count < rows.length;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentRows = this.paginatedRows;
    let nextSelected: T[];

    if (checked) {
      const idSet = new Set(this.selectedRows.map(r => this.getRowId(r, -1)));
      const toAdd = currentRows.filter(r => !idSet.has(this.getRowId(r, -1)));
      nextSelected = [...this.selectedRows, ...toAdd];
    } else {
      const currentIdSet = new Set(currentRows.map(r => this.getRowId(r, -1)));
      nextSelected = this.selectedRows.filter(r => !currentIdSet.has(this.getRowId(r, -1)));
    }

    this.selectedRows = nextSelected;
    this.selectionChange.emit(this.selectedRows);
  }

  toggleRowSelection(row: T, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const rowId = this.getRowId(row, -1);
    let nextSelected: T[];

    if (checked) {
      nextSelected = [...this.selectedRows, row];
    } else {
      nextSelected = this.selectedRows.filter(r => this.getRowId(r, -1) !== rowId);
    }

    this.selectedRows = nextSelected;
    this.selectionChange.emit(this.selectedRows);
  }

  getCellValue(row: any, key: string): any {
    return row ? row[key] : '';
  }

  getTemplate(col: TableColumn<T>): TemplateRef<any> | null {
    if (col.template) {
      return col.template;
    }

    const templateKey = col.templateName || col.key;

    // Check customTemplates dictionary
    if (this.customTemplates && this.customTemplates[templateKey]) {
      return this.customTemplates[templateKey];
    }

    // Check ContentChildren directives
    if (this.cellDirectives) {
      const match = this.cellDirectives.find(d => d.name === templateKey || d.name === col.key);
      if (match) {
        return match.template;
      }
    }

    return null;
  }

  getCellClass(col: TableColumn<T>, row: T): string {
    if (!col.cellClass) return '';
    return typeof col.cellClass === 'function' ? col.cellClass(row) : col.cellClass;
  }

  get filteredAndSortedRows(): T[] {
    const q = this.searchKeyword.toLowerCase().trim();
    let rows = this.data.filter((item: any) => {
      // 1. Search filtering
      let matchSearch = true;
      if (q) {
        if (this.searchFields && this.searchFields.length > 0) {
          matchSearch = this.searchFields.some(field => {
            const val = item[field];
            return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
          });
        } else {
          // Auto search all row values
          matchSearch = Object.values(item).some(val =>
            val !== undefined && val !== null && String(val).toLowerCase().includes(q)
          );
        }
      }

      // 2. Select filter
      let matchFilter = true;
      if (this.selectedFilter && this.selectedFilter !== 'ALL') {
        const filterVal = item[this.filterKey];
        matchFilter = String(filterVal) === this.selectedFilter;
      }

      return matchSearch && matchFilter;
    });

    // 3. Sorting
    if (this.sortState.field) {
      const field = this.sortState.field;
      const dir = this.sortState.direction === 'asc' ? 1 : -1;

      rows = [...rows].sort((a: any, b: any) => {
        const valA = a[field];
        const valB = b[field];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }

        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    return rows;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAndSortedRows.length / this.pageSize));
  }

  get paginatedRows(): T[] {
    if (!this.showPagination) {
      return this.filteredAndSortedRows;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAndSortedRows.slice(startIndex, startIndex + this.pageSize);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleSort(field: string): void {
    if (this.sortState.field === field) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.field = field;
      this.sortState.direction = 'asc';
    }
    this.onSort.emit({ ...this.sortState });
  }

  getSortIconClass(field: string): string {
    if (this.sortState.field !== field) {
      return 'fa-solid fa-sort text-neutral-500 text-[10px]';
    }
    return this.sortState.direction === 'asc'
      ? 'fa-solid fa-sort-up text-liver-red text-[10px]'
      : 'fa-solid fa-sort-down text-liver-red text-[10px]';
  }
}
