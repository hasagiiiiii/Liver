import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

export type DatepickerMode = 'date' | 'month' | 'quarter' | 'year';
export type DatepickerView = 'date' | 'month' | 'quarter' | 'year';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1.5 relative select-none" (appClickOutside)="closePopup()">
      @if (label) {
        <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
          {{ label }}
          @if (required) {
            <span class="text-liver-red">*</span>
          }
        </label>
      }

      <div class="relative">
        <!-- Input Control Wrapper with Direct Typing -->
        <div
          [class.border-liver-red]="isOpen"
          class="h-[42px] px-3 bg-white border border-neutral-300 hover:border-liver-red/60 rounded-lg flex items-center justify-between gap-2 transition-all focus-within:border-liver-red focus-within:ring-2 focus-within:ring-liver-red/20"
          [class.bg-neutral-100]="disabled"
          [class.cursor-not-allowed]="disabled"
        >
          <!-- Left Calendar/Mode Icon & Text Input -->
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              (click)="togglePopup()"
              [disabled]="disabled"
              class="text-liver-red focus:outline-none flex items-center shrink-0 cursor-pointer"
              title="Mở lịch chọn"
            >
              @if (isQuarterMode) {
                <i class="fa-solid fa-chart-pie text-xs"></i>
              } @else if (mode === 'month') {
                <i class="fa-solid fa-calendar-days text-xs"></i>
              } @else {
                <i class="fa-regular fa-calendar-check text-xs"></i>
              }
            </button>

            <!-- Direct Typing Input Field -->
            <input
              #inputEl
              type="text"
              [disabled]="disabled"
              [placeholder]="computedPlaceholder"
              [value]="displayValue"
              (focus)="openPopup()"
              (click)="openPopup()"
              (input)="onInputTyped($event)"
              (blur)="onInputBlur($event)"
              (keydown.enter)="onInputEnter()"
              class="w-full text-xs font-semibold text-liver-black bg-transparent focus:outline-none placeholder-neutral-400 disabled:cursor-not-allowed cursor-pointer"
            />
          </div>

          <!-- Right Action Controls (Clear + Chevron dropdown) -->
          <div class="flex items-center gap-1.5 shrink-0">
            @if (clearable && value && !disabled) {
              <button
                type="button"
                (click)="clear($event)"
                class="text-neutral-400 hover:text-liver-red text-xs transition-colors p-0.5"
                title="Xóa giá trị"
              >
                <i class="fa-solid fa-circle-xmark"></i>
              </button>
            }
            <button
              type="button"
              (click)="togglePopup()"
              [disabled]="disabled"
              class="text-neutral-400 hover:text-liver-black text-xs transition-transform p-0.5"
              [class.rotate-180]="isOpen"
              title="Đóng/Mở lịch"
            >
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>

        <!-- ==================== CUSTOM CALENDAR POPUP ==================== -->
        @if (isOpen) {
          <div
            class="dropdown-animate absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 z-50 p-4"
          >
            <!-- ==================== VIEW 1: DATE SELECTION (Chỉ khi không chọn quý) ==================== -->
            @if (!isQuarterMode && viewMode === 'date') {
              <!-- Date Header Navigation -->
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <button
                  type="button"
                  (click)="changeMonth(-1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Tháng trước"
                >
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                <div class="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-liver-black">
                  <button
                    type="button"
                    (click)="openMonthView()"
                    class="px-2 py-1 rounded-md hover:bg-liver-redLight hover:text-liver-red transition-colors"
                    title="Bấm để chọn tháng"
                  >
                    Tháng {{ currentMonth + 1 }}
                  </button>
                  <span class="text-neutral-300">/</span>
                  <button
                    type="button"
                    (click)="openYearView()"
                    class="px-2 py-1 rounded-md hover:bg-liver-redLight hover:text-liver-red transition-colors"
                    title="Bấm để chọn năm"
                  >
                    {{ currentYear }}
                  </button>
                </div>

                <button
                  type="button"
                  (click)="changeMonth(1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Tháng sau"
                >
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>

              <!-- Days Header (Mon -> Sun) -->
              <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-neutral-400 mb-1">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span class="text-liver-red">CN</span>
              </div>

              <!-- Calendar Days Grid -->
              <div class="grid grid-cols-7 gap-1 text-center text-xs">
                @for (blank of emptyDays; track $index) {
                  <div></div>
                }
                @for (day of daysInMonth; track day) {
                  <button
                    type="button"
                    (click)="selectDate(day)"
                    [class]="getDayClass(day)"
                    class="h-8 rounded-lg font-semibold transition-colors text-xs flex items-center justify-center"
                  >
                    {{ day }}
                  </button>
                }
              </div>
            }

            <!-- ==================== VIEW 2: MONTH SELECTION (Chỉ khi không chọn quý) ==================== -->
            @if (!isQuarterMode && viewMode === 'month') {
              <!-- Month Header Navigation -->
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <button
                  type="button"
                  (click)="changeYear(-1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Năm trước"
                >
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                <button
                  type="button"
                  (click)="openYearView()"
                  class="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider text-liver-black hover:bg-liver-redLight hover:text-liver-red transition-colors"
                  title="Bấm để chọn năm"
                >
                  Năm {{ currentYear }}
                </button>

                <button
                  type="button"
                  (click)="changeYear(1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Năm sau"
                >
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>

              <!-- 12 Months Grid (3 cols x 4 rows) -->
              <div class="grid grid-cols-3 gap-2 text-xs">
                @for (m of monthsList; track m.index) {
                  <button
                    type="button"
                    (click)="selectMonth(m.index)"
                    [class]="getMonthClass(m.index)"
                    class="py-2.5 px-2 rounded-lg font-semibold text-center transition-all border"
                  >
                    {{ m.label }}
                  </button>
                }
              </div>
            }

            <!-- ==================== VIEW 3: YEAR SELECTION ==================== -->
            @if (viewMode === 'year') {
              <!-- Decade Header Navigation -->
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <button
                  type="button"
                  (click)="changeDecade(-1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Thập kỷ trước"
                >
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                <span class="text-xs font-extrabold uppercase tracking-wider text-liver-black">
                  {{ decadeStart }} - {{ decadeEnd }}
                </span>

                <button
                  type="button"
                  (click)="changeDecade(1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Thập kỷ sau"
                >
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>

              <!-- 12 Years Grid (3 cols x 4 rows) -->
              <div class="grid grid-cols-3 gap-2 text-xs">
                @for (y of decadeYears; track y) {
                  <button
                    type="button"
                    (click)="selectYear(y)"
                    [class]="getYearClass(y)"
                    class="py-2.5 px-2 rounded-lg font-semibold text-center transition-all border"
                  >
                    {{ y }}
                  </button>
                }
              </div>
            }

            <!-- ==================== VIEW 4: QUARTER SELECTION (Chỉ khi chọn quý) ==================== -->
            @if (isQuarterMode && viewMode === 'quarter') {
              <!-- Quarter Header Navigation -->
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <button
                  type="button"
                  (click)="changeYear(-1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Năm trước"
                >
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>

                <button
                  type="button"
                  (click)="openYearView()"
                  class="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider text-liver-black hover:bg-liver-redLight hover:text-liver-red transition-colors"
                  title="Bấm để chọn năm"
                >
                  Năm {{ currentYear }}
                </button>

                <button
                  type="button"
                  (click)="changeYear(1)"
                  class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
                  title="Năm sau"
                >
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>

              <!-- 4 Quarters Grid (2 cols x 2 rows) -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                @for (q of quartersList; track q.quarter) {
                  <button
                    type="button"
                    (click)="selectQuarter(q.quarter)"
                    [class]="getQuarterClass(q.quarter)"
                    class="p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-sm">{{ q.label }}</span>
                      <i class="fa-solid fa-chart-pie text-[11px] opacity-70"></i>
                    </div>
                    <span class="text-[10px] opacity-80">{{ q.months }}</span>
                  </button>
                }
              </div>
            }

            <!-- ==================== POPUP FOOTER ==================== -->
            <div class="mt-3 pt-2.5 border-t border-neutral-100 flex justify-between items-center text-xs">
              <button
                type="button"
                (click)="selectCurrentPeriod()"
                class="font-bold text-liver-red hover:underline"
              >
                {{ currentPeriodButtonText }}
              </button>

              <button
                type="button"
                (click)="closePopup()"
                class="font-semibold text-neutral-500 hover:text-liver-black transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        }
      </div>

      @if (hint) {
        <p class="text-[11px] text-neutral-500">{{ hint }}</p>
      }
    </div>
  `
})
export class DatepickerComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;
  @Input() clearable = true;
  @Input() mode: DatepickerMode = 'date';
  @Input() allowQuarter = false;
  @Input() quarter = false; // Bật tính năng chọn Quý (hỗ trợ cả quarter hoặc allowQuarter)

  get isQuarterMode(): boolean {
    return this.mode === 'quarter' || this.quarter || this.allowQuarter;
  }

  get isQuarterEnabled(): boolean {
    return this.isQuarterMode;
  }

  value = '';
  isOpen = false;

  // Active view in the popup ('date' | 'month' | 'quarter' | 'year')
  viewMode: DatepickerView = 'date';

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth(); // 0-indexed (0..11)
  selectedQuarter = Math.floor(new Date().getMonth() / 3) + 1; // 1..4

  emptyDays: number[] = [];
  daysInMonth: number[] = [];

  readonly monthsList = [
    { index: 0, label: 'Tháng 1' },
    { index: 1, label: 'Tháng 2' },
    { index: 2, label: 'Tháng 3' },
    { index: 3, label: 'Tháng 4' },
    { index: 4, label: 'Tháng 5' },
    { index: 5, label: 'Tháng 6' },
    { index: 6, label: 'Tháng 7' },
    { index: 7, label: 'Tháng 8' },
    { index: 8, label: 'Tháng 9' },
    { index: 9, label: 'Tháng 10' },
    { index: 10, label: 'Tháng 11' },
    { index: 11, label: 'Tháng 12' }
  ];

  readonly quartersList = [
    { quarter: 1, label: 'Quý 1', months: 'Tháng 1 - Tháng 3' },
    { quarter: 2, label: 'Quý 2', months: 'Tháng 4 - Tháng 6' },
    { quarter: 3, label: 'Quý 3', months: 'Tháng 7 - Tháng 9' },
    { quarter: 4, label: 'Quý 4', months: 'Tháng 10 - Tháng 12' }
  ];

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.viewMode = this.isQuarterMode ? 'quarter' : this.mode;
    this.calculateCalendar();
  }

  get computedPlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    if (this.isQuarterMode) return 'Chọn hoặc gõ Quý (VD: Quý 1, 2026)...';
    if (this.mode === 'month') return 'Chọn hoặc gõ Tháng (VD: 11/2026)...';
    if (this.mode === 'year') return 'Chọn hoặc gõ Năm (VD: 2026)...';
    return 'DD/MM/YYYY (gõ hoặc chọn lịch)...';
  }

  get displayValue(): string {
    if (!this.value) return '';
    if (this.isQuarterMode || this.value.includes('-Q')) {
      const match = this.value.match(/^(\d{4})-Q([1-4])$/i);
      if (match) return `Quý ${match[2]}, ${match[1]}`;
      return this.value;
    }
    if (this.mode === 'month') {
      const parts = this.value.split('-');
      if (parts.length >= 2) {
        return `${parts[1].padStart(2, '0')}/${parts[0]}`;
      }
      return this.value;
    }
    if (this.mode === 'year') {
      return this.value;
    }
    // Default 'date' mode: format YYYY-MM-DD -> DD/MM/YYYY
    const parts = this.value.split('-');
    if (parts.length === 3) {
      return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
    }
    return this.value;
  }

  get decadeStart(): number {
    return Math.floor(this.currentYear / 10) * 10;
  }

  get decadeEnd(): number {
    return this.decadeStart + 9;
  }

  get decadeYears(): number[] {
    const start = this.decadeStart - 1;
    return Array.from({ length: 12 }, (_, i) => start + i);
  }

  get currentPeriodButtonText(): string {
    if (this.isQuarterMode) return 'Quý này';
    if (this.viewMode === 'month' || this.mode === 'month') return 'Tháng này';
    if (this.viewMode === 'year' || this.mode === 'year') return 'Năm nay';
    return 'Hôm nay';
  }

  writeValue(val: string): void {
    if (val) {
      this.value = val;
      this.parseValueToState(val);
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openPopup(): void {
    if (this.disabled || this.isOpen) return;
    this.isOpen = true;
    this.viewMode = this.isQuarterMode ? 'quarter' : this.mode;
    if (this.value) {
      this.parseValueToState(this.value);
    }
    this.calculateCalendar();
  }

  togglePopup(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.viewMode = this.isQuarterMode ? 'quarter' : this.mode;
      if (this.value) {
        this.parseValueToState(this.value);
      }
      this.calculateCalendar();
    }
  }

  closePopup(): void {
    this.isOpen = false;
  }

  clear(event?: Event): void {
    if (event) event.stopPropagation();
    this.value = '';
    this.onChange('');
    this.onTouched();
  }

  // ==================== DIRECT TYPING HANDLERS ====================

  onInputTyped(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    if (!input) return;

    if (this.isQuarterMode) {
      // Khi đã bật chọn Quý thì chỉ cho phép nhập Quý, không parse ngày tháng
      const qMatch = input.match(/(?:quý\s*|q)([1-4])[\s\/\-\,]*(\d{4})/i) ||
                     input.match(/(\d{4})[\s\/\-\,]*(?:quý\s*|q)([1-4])/i) ||
                     input.match(/^([1-4])[\/\-](\d{4})$/);
      if (qMatch) {
        let q = 0, y = 0;
        const first = parseInt(qMatch[1], 10);
        const second = parseInt(qMatch[2], 10);
        if (first <= 4 && second >= 1900) {
          q = first;
          y = second;
        } else if (second <= 4 && first >= 1900) {
          y = first;
          q = second;
        }
        if (y >= 1900 && y <= 2100 && q >= 1 && q <= 4) {
          this.currentYear = y;
          this.selectedQuarter = q;
          this.value = `${y}-Q${q}`;
          this.onChange(this.value);
        }
      }
      return;
    }

    if (this.mode === 'date') {
      const dmy = input.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
      const ymd = input.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
      let day = 0, month = 0, year = 0;
      if (dmy) {
        day = parseInt(dmy[1], 10);
        month = parseInt(dmy[2], 10);
        year = parseInt(dmy[3], 10);
      } else if (ymd) {
        year = parseInt(ymd[1], 10);
        month = parseInt(ymd[2], 10);
        day = parseInt(ymd[3], 10);
      }

      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12) {
        const daysInTargetMonth = new Date(year, month, 0).getDate();
        if (day >= 1 && day <= daysInTargetMonth) {
          this.currentYear = year;
          this.currentMonth = month - 1;
          this.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          this.calculateCalendar();
          this.onChange(this.value);
        }
      }
    } else if (this.mode === 'month') {
      const my = input.match(/^(\d{1,2})[\/\-\.](\d{4})$/);
      const ym = input.match(/^(\d{4})[\/\-\.](\d{1,2})$/);
      let month = 0, year = 0;
      if (my) {
        month = parseInt(my[1], 10);
        year = parseInt(my[2], 10);
      } else if (ym) {
        year = parseInt(ym[1], 10);
        month = parseInt(ym[2], 10);
      }
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12) {
        this.currentYear = year;
        this.currentMonth = month - 1;
        this.value = `${year}-${String(month).padStart(2, '0')}`;
        this.onChange(this.value);
      }
    } else if (this.mode === 'year') {
      const yMatch = input.match(/^(\d{4})$/);
      if (yMatch) {
        const y = parseInt(yMatch[1], 10);
        if (y >= 1900 && y <= 2100) {
          this.currentYear = y;
          this.value = `${y}`;
          this.onChange(this.value);
        }
      }
    }
  }

  onInputBlur(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.value.trim()) {
      this.value = '';
      this.onChange('');
    } else {
      // Revert input field text to formatted value if text was incomplete or invalid
      inputEl.value = this.displayValue;
    }
    this.onTouched();
  }

  onInputEnter(): void {
    this.closePopup();
  }

  // ==================== VIEW MODES & NAVIGATION ====================

  switchViewMode(target: DatepickerView): void {
    this.viewMode = target;
    if (target === 'date') {
      this.calculateCalendar();
    }
  }

  openMonthView(): void {
    this.viewMode = 'month';
  }

  openYearView(): void {
    this.viewMode = 'year';
  }

  changeMonth(offset: number): void {
    this.currentMonth += offset;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.calculateCalendar();
  }

  changeYear(offset: number): void {
    this.currentYear += offset;
    this.calculateCalendar();
  }

  changeDecade(offset: number): void {
    this.currentYear += offset * 10;
  }

  calculateCalendar(): void {
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    // Monday as start of week: Monday is 0, Sunday is 6
    const firstDayIndex = (new Date(this.currentYear, this.currentMonth, 1).getDay() + 6) % 7;

    this.emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  // ==================== SELECTION LOGIC ====================

  selectDate(day: number): void {
    const monthStr = String(this.currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    this.value = `${this.currentYear}-${monthStr}-${dayStr}`;
    this.onChange(this.value);
    this.onTouched();
    this.closePopup();
  }

  selectMonth(monthIndex: number): void {
    this.currentMonth = monthIndex;
    if (this.mode === 'month') {
      const monthStr = String(monthIndex + 1).padStart(2, '0');
      this.value = `${this.currentYear}-${monthStr}`;
      this.onChange(this.value);
      this.onTouched();
      this.closePopup();
    } else {
      // In date mode: return to date view for selected month
      this.viewMode = 'date';
      this.calculateCalendar();
    }
  }

  selectYear(year: number): void {
    this.currentYear = year;
    if (this.isQuarterMode) {
      this.viewMode = 'quarter'; // Chọn năm xong lập tức quay về chọn Quý, không bao giờ qua tháng hay ngày
    } else if (this.mode === 'year') {
      this.value = `${year}`;
      this.onChange(this.value);
      this.onTouched();
      this.closePopup();
    } else if (this.mode === 'month') {
      this.viewMode = 'month';
    } else {
      // In date mode: navigate to month view first
      this.viewMode = 'month';
    }
  }

  selectQuarter(quarter: number): void {
    this.selectedQuarter = quarter;
    this.value = `${this.currentYear}-Q${quarter}`;
    this.onChange(this.value);
    this.onTouched();
    this.closePopup();
  }

  selectCurrentPeriod(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();

    if (this.isQuarterMode) {
      const q = Math.floor(today.getMonth() / 3) + 1;
      this.selectQuarter(q);
    } else if (this.viewMode === 'month' || this.mode === 'month') {
      this.selectMonth(today.getMonth());
    } else if (this.viewMode === 'year' || this.mode === 'year') {
      this.selectYear(today.getFullYear());
    } else {
      this.selectDate(today.getDate());
    }
  }

  // ==================== CLASS GETTERS ====================

  getDayClass(day: number): string {
    const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (this.value === dateStr) {
      return 'bg-liver-red text-white font-bold shadow-md shadow-liver-red/25';
    }
    const today = new Date();
    const isToday = today.getFullYear() === this.currentYear &&
                    today.getMonth() === this.currentMonth &&
                    today.getDate() === day;
    if (isToday) {
      return 'border border-liver-red/60 text-liver-red font-bold hover:bg-liver-redLight';
    }
    return 'hover:bg-neutral-900 hover:text-white text-liver-black';
  }

  getMonthClass(monthIndex: number): string {
    const isSelected = (this.mode === 'month' && this.value === `${this.currentYear}-${String(monthIndex + 1).padStart(2, '0')}`) ||
                       (this.mode === 'date' && this.currentMonth === monthIndex);
    if (isSelected) {
      return 'bg-liver-red text-white font-bold border-liver-red shadow-md shadow-liver-red/25';
    }
    const today = new Date();
    const isCurrent = today.getFullYear() === this.currentYear && today.getMonth() === monthIndex;
    if (isCurrent) {
      return 'border-liver-red/60 text-liver-red font-bold hover:bg-liver-redLight';
    }
    return 'border-neutral-200 bg-white hover:bg-liver-redLight hover:border-liver-redBorder hover:text-liver-red text-liver-black';
  }

  getYearClass(year: number): string {
    const isSelected = (this.mode === 'year' && this.value === `${year}`) || this.currentYear === year;
    if (isSelected) {
      return 'bg-liver-red text-white font-bold border-liver-red shadow-md shadow-liver-red/25';
    }
    const today = new Date();
    if (today.getFullYear() === year) {
      return 'border-liver-red/60 text-liver-red font-bold hover:bg-liver-redLight';
    }
    const isOutOfDecade = year < this.decadeStart || year > this.decadeEnd;
    if (isOutOfDecade) {
      return 'border-neutral-100 text-neutral-400 hover:text-liver-black hover:border-neutral-300';
    }
    return 'border-neutral-200 bg-white hover:bg-liver-redLight hover:border-liver-redBorder hover:text-liver-red text-liver-black';
  }

  getQuarterClass(quarter: number): string {
    const isSelected = this.value === `${this.currentYear}-Q${quarter}`;
    if (isSelected) {
      return 'bg-liver-red text-white border-liver-red shadow-md shadow-liver-red/25';
    }
    const today = new Date();
    const currentQ = Math.floor(today.getMonth() / 3) + 1;
    const isCurrent = today.getFullYear() === this.currentYear && currentQ === quarter;
    if (isCurrent) {
      return 'border-liver-red/60 text-liver-red font-bold bg-white hover:bg-liver-redLight';
    }
    return 'border-neutral-200 bg-white hover:bg-liver-redLight hover:border-liver-redBorder text-liver-black';
  }

  private parseValueToState(val: string): void {
    if (val.includes('-Q')) {
      const parts = val.split('-Q');
      this.currentYear = parseInt(parts[0], 10);
      this.selectedQuarter = parseInt(parts[1], 10);
    } else {
      const parts = val.split('-');
      if (parts.length >= 1) {
        this.currentYear = parseInt(parts[0], 10);
      }
      if (parts.length >= 2) {
        this.currentMonth = parseInt(parts[1], 10) - 1;
      }
    }
  }
}
