import { Component, forwardRef, Input, OnInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

export interface SelectOption {
  id: string;
  name?: string;
  label?: string;
  role?: string;
  avatar?: string;
  icon?: string;
  type?: 'locked' | 'accent' | 'default';
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective, TooltipDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1.5 relative" [class.z-40]="isOpen || isTagDropdownOpen" (appClickOutside)="closeDropdown()">
      <!-- Label Header -->
      <div class="flex items-center justify-between">
        @if (label) {
          <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
            {{ label }}
            @if (required) {
              <span class="text-liver-red">*</span>
            }
          </label>
        }

        @if (mode === 'multiple') {
          <span class="text-[10px] font-bold text-liver-red bg-liver-redLight px-1.5 py-0.5 rounded border border-liver-redBorder">
            Đã chọn: {{ selectedIds.length }}
          </span>
        } @else if (addTag) {
          <span class="text-[10px] text-neutral-500">Gõ từ khóa và nhấn <b>Enter</b> để thêm Tag</span>
        }
      </div>

      <!-- ==================== CASE 1: SINGLE SELECT ==================== -->
      @if (mode === 'single') {
        <div class="relative">
          <div
            (click)="toggleDropdown()"
            [class.border-liver-red]="isOpen"
            class="h-[42px] px-3.5 bg-white border border-neutral-300 hover:border-liver-red/60 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-all"
          >
            <div class="flex items-center gap-2 truncate text-xs font-semibold text-liver-black">
              @if (selectedSingleOption) {
                <div class="w-6 h-6 rounded bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {{ selectedSingleOption.avatar || 'U' }}
                </div>
                <div class="truncate">
                  <span class="font-bold text-liver-black">{{ selectedSingleOption.name || selectedSingleOption.label }}</span>
                  @if (selectedSingleOption.role) {
                    <span class="text-neutral-400 font-normal ml-1">({{ selectedSingleOption.role }})</span>
                  }
                </div>
              } @else {
                <span class="text-neutral-400 font-normal">{{ placeholder || 'Chọn một mục...' }}</span>
              }
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              @if (selectedSingleOption && !disabled) {
                <button
                  type="button"
                  (click)="clearSingle($event)"
                  class="text-neutral-400 hover:text-liver-red text-xs transition-colors"
                  title="Bỏ chọn"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <span class="text-neutral-300">|</span>
              }
              <i class="fa-solid fa-chevron-down text-xs text-neutral-500 transition-transform" [class.rotate-180]="isOpen"></i>
            </div>
          </div>

          <!-- Single Dropdown -->
          @if (isOpen) {
            <div
              [ngClass]="isDropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
              class="dropdown-animate absolute left-0 right-0 bg-white rounded-xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 z-50 overflow-hidden"
            >
              <div class="p-2 border-b border-neutral-100 bg-neutral-50">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-neutral-400"></i>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    [placeholder]="searchPlaceholder || 'Tìm kiếm...'"
                    class="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-liver-red focus:ring-1 focus:ring-liver-red/20"
                  />
                </div>
              </div>

              <ul class="max-h-48 overflow-y-auto divide-y divide-neutral-100 text-xs">
                @for (opt of filteredOptions; track opt.id) {
                  <li
                    (click)="selectSingle(opt)"
                    [class.bg-liver-redLight]="selectedSingleId === opt.id"
                    class="p-2.5 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                        {{ opt.avatar || 'U' }}
                      </div>
                      <div>
                        <div class="font-bold text-liver-black">{{ opt.name || opt.label }}</div>
                        @if (opt.role) {
                          <div class="text-[11px] text-neutral-500">{{ opt.role }}</div>
                        }
                      </div>
                    </div>
                    @if (selectedSingleId === opt.id) {
                      <i class="fa-solid fa-check text-liver-red text-sm font-bold"></i>
                    }
                  </li>
                } @empty {
                  <li class="p-4 text-center text-neutral-400 text-xs">Không tìm thấy kết quả phù hợp</li>
                }
              </ul>
            </div>
          }
        </div>
      }

      <!-- ==================== CASE 2: MULTIPLE SELECT WITH +N TAG OVERFLOW ==================== -->
      @if (mode === 'multiple') {
        <div class="relative">
          <div
            (click)="toggleDropdown()"
            [class.border-liver-red]="isOpen"
            class="h-[42px] px-2.5 bg-white border border-neutral-300 hover:border-liver-red/60 rounded-lg flex items-center justify-between gap-1.5 cursor-pointer transition-all overflow-hidden"
          >
            <!-- Visible Tags & +N badge -->
            <div class="flex items-center gap-1.5 flex-1 overflow-hidden whitespace-nowrap">
              @for (tag of visibleMultiTags; track tag.id) {
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 text-white text-[11px] font-medium shrink-0">
                  @if (tag.icon) {
                    <i [class]="tag.icon + ' text-[10px]'"></i>
                  }
                  <span>{{ tag.name || tag.label }}</span>
                  <button
                    type="button"
                    (click)="removeMultiTag(tag.id, $event)"
                    class="hover:text-liver-red text-[10px] ml-0.5"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </span>
              }

              <!-- +N Tag Badge with Tooltip -->
              @if (hiddenMultiCount > 0) {
                <span
                  [appTooltip]="hiddenMultiTooltipText"
                  class="px-2 py-0.5 rounded bg-liver-red text-white text-[11px] font-bold shrink-0 shadow-sm cursor-help"
                  title="Hover xem thêm các tag đã chọn"
                >
                  +{{ hiddenMultiCount }} tag
                </span>
              }

              @if (selectedIds.length === 0) {
                <span class="text-neutral-400 text-xs font-normal">{{ placeholder || 'Chọn các công nghệ...' }}</span>
              }
            </div>

            <!-- Right Controls -->
            <div class="flex items-center gap-1.5 shrink-0 pl-1">
              @if (selectedIds.length > 0 && !disabled) {
                <button
                  type="button"
                  (click)="clearAllMulti($event)"
                  class="text-neutral-400 hover:text-liver-red text-xs"
                  title="Xóa tất cả tag"
                >
                  <i class="fa-solid fa-circle-xmark"></i>
                </button>
                <span class="text-neutral-300">|</span>
              }
              <i class="fa-solid fa-chevron-down text-xs text-neutral-500 transition-transform" [class.rotate-180]="isOpen"></i>
            </div>
          </div>

          <!-- Multiple Dropdown Menu -->
          @if (isOpen) {
            <div
              [ngClass]="isDropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
              class="dropdown-animate absolute left-0 right-0 bg-white rounded-xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 z-50 overflow-hidden"
            >
              <div class="p-2 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between gap-2">
                <div class="relative flex-1">
                  <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-neutral-400"></i>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    placeholder="Tìm kiếm công nghệ..."
                    class="w-full pl-8 pr-3 py-1 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-liver-red focus:ring-1 focus:ring-liver-red/20"
                  />
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <button type="button" (click)="selectAllMulti($event)" class="font-bold text-liver-red hover:underline">
                    Chọn hết
                  </button>
                  <button type="button" (click)="clearAllMulti($event)" class="font-semibold text-neutral-500 hover:text-liver-black">
                    Bỏ chọn
                  </button>
                </div>
              </div>

              <div class="p-2.5 max-h-52 overflow-y-auto grid grid-cols-2 gap-1.5 text-xs">
                @for (opt of filteredOptions; track opt.id) {
                  <label
                    (click)="toggleMultiOption(opt.id, $event)"
                    [class.border-liver-red]="isMultiSelected(opt.id)"
                    [class.bg-liver-redLight]="isMultiSelected(opt.id)"
                    class="flex items-center justify-between p-2 rounded-lg border border-neutral-200 hover:border-liver-red/60 cursor-pointer transition-colors"
                  >
                    <div class="flex items-center gap-2 truncate">
                      @if (opt.icon) {
                        <i [class]="opt.icon"></i>
                      }
                      <span class="font-medium text-liver-black truncate">{{ opt.name || opt.label }}</span>
                    </div>
                    <div
                      [class.bg-liver-red]="isMultiSelected(opt.id)"
                      [class.border-liver-red]="isMultiSelected(opt.id)"
                      class="w-4 h-4 rounded border border-neutral-300 flex items-center justify-center text-white text-[10px]"
                    >
                      @if (isMultiSelected(opt.id)) {
                        <i class="fa-solid fa-check"></i>
                      }
                    </div>
                  </label>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- ==================== CASE 3: TAGGING SELECT ([addTag]="true") ==================== -->
      @if (addTag) {
        <div class="relative">
          <div
            (click)="focusTagInput(tagInput)"
            class="min-h-[42px] px-2.5 py-1.5 bg-white border border-neutral-300 hover:border-liver-red/60 focus-within:border-liver-red rounded-lg flex flex-wrap items-center gap-1.5 cursor-text transition-all"
          >
            <!-- Tags List with 3 State Types: locked, accent/critical, default -->
            @for (tag of customTags; track tag.id) {
              <span
                [ngClass]="{
                  'bg-neutral-800 text-neutral-300 border-neutral-700': tag.type === 'locked',
                  'bg-liver-red text-white border-liver-redHover shadow-sm shadow-liver-red/20': tag.type === 'accent',
                  'bg-neutral-900 text-white border-neutral-800': tag.type === 'default' || !tag.type
                }"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all"
              >
                @if (tag.type === 'locked') {
                  <i class="fa-solid fa-lock text-[10px] text-amber-400" title="Tag cố định"></i>
                } @else if (tag.type === 'accent') {
                  <i class="fa-solid fa-fire text-[10px] text-amber-300"></i>
                } @else {
                  <i class="fa-solid fa-tag text-[10px] text-neutral-400"></i>
                }

                <span>{{ tag.label }}</span>

                @if (tag.type !== 'locked' && !disabled) {
                  <button
                    type="button"
                    (click)="removeCustomTag(tag.id, $event)"
                    class="hover:text-liver-red text-[11px] ml-0.5 transition-colors"
                    title="Xóa tag"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                }
              </span>
            }

            <!-- Inline Input for Enter-to-Add -->
            <input
              #tagInput
              type="text"
              [(ngModel)]="newTagInputText"
              (focus)="openTagDropdown()"
              (keydown)="handleTagKeydown($event)"
              placeholder="+ Nhập tên tag mới rồi nhấn Enter..."
              [disabled]="disabled"
              class="flex-1 min-w-[180px] text-xs font-medium text-liver-black bg-transparent focus:outline-none py-1 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Suggestions & Quick Select Dropdown -->
          @if (isTagDropdownOpen) {
            <div
              [ngClass]="isDropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
              class="dropdown-animate absolute left-0 right-0 bg-white rounded-xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 z-50 overflow-hidden"
            >
              <div class="px-3 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-[11px]">
                <span class="font-bold text-neutral-500 uppercase">Tag gợi ý & Phân loại</span>
                <span class="text-neutral-400">Nhấn Enter để thêm tag tùy chọn</span>
              </div>

              <div class="p-2 max-h-44 overflow-y-auto space-y-1 text-xs">
                @for (sug of tagSuggestions; track sug.id) {
                  <div
                    (click)="addSuggestedTag(sug)"
                    class="p-2 rounded-lg hover:bg-neutral-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div class="flex items-center gap-2">
                      <span
                        [ngClass]="{
                          'bg-liver-redLight text-liver-red border border-liver-redBorder': sug.type === 'accent',
                          'bg-amber-100 text-amber-800': sug.type === 'locked',
                          'bg-neutral-100 text-neutral-800': sug.type === 'default'
                        }"
                        class="px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        {{ sug.type === 'accent' ? 'Critical' : sug.type === 'locked' ? 'Locked' : 'Default' }}
                      </span>
                      <span class="font-medium text-liver-black">{{ sug.label }}</span>
                    </div>
                    <i class="fa-solid fa-plus text-neutral-400 hover:text-liver-red"></i>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      @if (hint) {
        <p class="text-[11px] text-neutral-500">{{ hint }}</p>
      }
    </div>
  `
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  private readonly elementRef = inject(ElementRef);

  @Input() mode: 'single' | 'multiple' | 'none' = 'single';
  @Input() addTag = false;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() searchPlaceholder = '';
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;
  @Input() maxVisibleTags = 2; // For multiple overflow
  @Input() placement: 'auto' | 'top' | 'bottom' = 'auto';

  @Input() options: SelectOption[] = [];

  isOpen = false;
  isTagDropdownOpen = false;
  isDropUp = false;
  searchQuery = '';
  newTagInputText = '';

  // Single select state
  selectedSingleId = '';

  // Multiple select state
  selectedIds: string[] = [];

  // Tagging select state
  customTags: { id: string; label: string; type: 'locked' | 'accent' | 'default' }[] = [];

  @Input() tagSuggestions: { id: string; label: string; type: 'locked' | 'accent' | 'default' }[] = [
    { id: 's1', label: 'Security-Audit-Pass', type: 'accent' },
    { id: 's2', label: 'Dockerized-Env', type: 'default' },
    { id: 's3', label: 'Strict-Mode', type: 'locked' },
    { id: 's4', label: 'Hotfix-Deploy', type: 'accent' }
  ];

  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    if (this.addTag && this.customTags.length === 0) {
      this.customTags = [
        { id: 't1', label: 'Core-System', type: 'locked' },
        { id: 't2', label: 'High-Priority', type: 'accent' },
        { id: 't3', label: 'Release-v2.4', type: 'default' }
      ];
    }
  }

  // Filtered options based on search query
  get filteredOptions(): SelectOption[] {
    if (!this.searchQuery) return this.options;
    const q = this.searchQuery.toLowerCase();
    return this.options.filter(
      opt => (opt.name || opt.label || '').toLowerCase().includes(q) || (opt.role || '').toLowerCase().includes(q)
    );
  }

  // Single select computed
  get selectedSingleOption(): SelectOption | undefined {
    return this.options.find(opt => opt.id === this.selectedSingleId);
  }

  // Multiple select computed
  get visibleMultiTags(): SelectOption[] {
    const selected = this.options.filter(o => this.selectedIds.includes(o.id));
    return selected.slice(0, this.maxVisibleTags);
  }

  get hiddenMultiCount(): number {
    const total = this.selectedIds.length;
    return Math.max(0, total - this.maxVisibleTags);
  }

  get hiddenMultiTooltipText(): string {
    const selected = this.options.filter(o => this.selectedIds.includes(o.id));
    const hidden = selected.slice(this.maxVisibleTags);
    return 'Các tag khác: ' + hidden.map(h => h.name || h.label).join(', ');
  }

  // CVA methods
  writeValue(val: any): void {
    if (this.mode === 'single') {
      this.selectedSingleId = val || '';
    } else if (this.mode === 'multiple') {
      this.selectedIds = Array.isArray(val) ? [...val] : [];
    } else if (this.addTag) {
      if (Array.isArray(val)) {
        this.customTags = [...val];
      }
    }
  }

  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
      this.calculatePlacement();
    }
  }

  private calculatePlacement(): void {
    if (this.placement === 'top') {
      this.isDropUp = true;
      return;
    }
    if (this.placement === 'bottom') {
      this.isDropUp = false;
      return;
    }
    if (typeof window !== 'undefined' && this.elementRef?.nativeElement) {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Dropdown menu is ~220px. If space below is less than 260px and space above is greater:
      this.isDropUp = spaceBelow < 260 && spaceAbove > spaceBelow;
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.isTagDropdownOpen = false;
  }

  // Single select actions
  selectSingle(opt: SelectOption): void {
    this.selectedSingleId = opt.id;
    this.onChange(this.selectedSingleId);
    this.onTouched();
    this.isOpen = false;
  }

  clearSingle(event: Event): void {
    event.stopPropagation();
    this.selectedSingleId = '';
    this.onChange('');
    this.onTouched();
  }

  // Multiple select actions
  isMultiSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  toggleMultiOption(id: string, event: Event): void {
    event.stopPropagation();
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
    this.onChange([...this.selectedIds]);
    this.onTouched();
  }

  removeMultiTag(id: string, event: Event): void {
    event.stopPropagation();
    this.selectedIds = this.selectedIds.filter(x => x !== id);
    this.onChange([...this.selectedIds]);
    this.onTouched();
  }

  selectAllMulti(event: Event): void {
    event.stopPropagation();
    this.selectedIds = this.options.map(o => o.id);
    this.onChange([...this.selectedIds]);
    this.onTouched();
  }

  clearAllMulti(event: Event): void {
    event.stopPropagation();
    this.selectedIds = [];
    this.onChange([]);
    this.onTouched();
  }

  // Tag select actions
  focusTagInput(inputEl: HTMLInputElement): void {
    inputEl.focus();
  }

  openTagDropdown(): void {
    this.isTagDropdownOpen = true;
    this.calculatePlacement();
  }

  handleTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const val = this.newTagInputText.trim();
      if (val) {
        // Add new tag with default type
        const newId = `tag-${Date.now()}`;
        this.customTags.push({
          id: newId,
          label: val,
          type: 'default'
        });
        this.newTagInputText = '';
        this.onChange([...this.customTags]);
        this.onTouched();
      }
    } else if (event.key === 'Backspace' && !this.newTagInputText && this.customTags.length > 0) {
      // Remove last tag if not locked
      const lastTag = this.customTags[this.customTags.length - 1];
      if (lastTag.type !== 'locked') {
        this.customTags.pop();
        this.onChange([...this.customTags]);
        this.onTouched();
      }
    }
  }

  removeCustomTag(id: string, event: Event): void {
    event.stopPropagation();
    this.customTags = this.customTags.filter(t => t.id !== id);
    this.onChange([...this.customTags]);
    this.onTouched();
  }

  addSuggestedTag(sug: { id: string; label: string; type: 'locked' | 'accent' | 'default' }): void {
    if (!this.customTags.some(t => t.label.toLowerCase() === sug.label.toLowerCase())) {
      this.customTags.push({
        id: `sug-${Date.now()}`,
        label: sug.label,
        type: sug.type
      });
      this.onChange([...this.customTags]);
      this.onTouched();
    }
    this.isTagDropdownOpen = false;
  }
}
