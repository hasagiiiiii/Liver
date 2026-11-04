import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-date-range',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, DateFormatPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1.5 relative" (appClickOutside)="closePopup()">
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
          <!-- Left Calendar Icon & Text Input -->
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              (click)="togglePopup()"
              [disabled]="disabled"
              class="text-liver-red focus:outline-none flex items-center shrink-0 cursor-pointer"
              title="Mở lịch chọn khoảng thời gian"
            >
              <i class="fa-solid fa-calendar-week text-xs"></i>
            </button>

            <!-- Direct Typing / Display Range Input -->
            <input
              #rangeInput
              type="text"
              [disabled]="disabled"
              [placeholder]="placeholder"
              [value]="displayValue"
              (focus)="openPopup()"
              (click)="openPopup()"
              (input)="onInputTyped($event)"
              (blur)="onInputBlur($event)"
              (keydown.enter)="closePopup()"
              class="w-full text-xs font-semibold text-liver-black bg-transparent focus:outline-none placeholder-neutral-400 disabled:cursor-not-allowed cursor-pointer"
            />
          </div>

          <!-- Right Action Controls (Total Days badge, Clear, Chevron) -->
          <div class="flex items-center gap-1.5 shrink-0">
            @if (value.startDate && value.endDate) {
              <span class="px-2 py-0.5 rounded-full bg-liver-redLight text-liver-red border border-liver-redBorder text-[10px] font-bold">
                {{ totalDays }} ngày
              </span>
            }
            @if (clearable && (value.startDate || value.endDate) && !disabled) {
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

        <!-- Unified Date Range Popup -->
        @if (isOpen) {
          <div
            class="dropdown-animate absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 hover:border-liver-redBorder/80 z-50 p-4"
          >
            <!-- Header mode & quick select -->
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
              <div class="flex items-center gap-2">
                <span
                  [class]="selectingState === 'START' ? 'bg-liver-black text-white' : 'bg-liver-red text-white'"
                  class="px-2 py-0.5 rounded text-[10px] uppercase font-bold"
                >
                  {{ selectingState === 'START' ? 'Chọn Từ Ngày' : 'Chọn Đến Ngày' }}
                </span>
                <span class="text-xs font-extrabold text-liver-black">
                  {{ (selectingState === 'START' ? value.startDate : value.endDate) | dateFormat }}
                </span>
              </div>

              <!-- Quick presets -->
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="setQuickRange(7)"
                  class="text-[10px] font-bold px-2 py-1 rounded bg-neutral-100 hover:bg-liver-black hover:text-white transition-colors"
                >
                  7N
                </button>
                <button
                  type="button"
                  (click)="setQuickRange(30)"
                  class="text-[10px] font-bold px-2 py-1 rounded bg-neutral-100 hover:bg-liver-black hover:text-white transition-colors"
                >
                  30N
                </button>
              </div>
            </div>

            <!-- Month navigation -->
            <div class="flex items-center justify-between mb-3">
              <button
                type="button"
                (click)="changeMonth(-1)"
                class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
              >
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <span class="text-xs font-extrabold uppercase tracking-wider text-liver-black">
                Tháng {{ currentMonth + 1 }}, {{ currentYear }}
              </span>
              <button
                type="button"
                (click)="changeMonth(1)"
                class="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-liver-black transition-colors"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>

            <!-- Days Header -->
            <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-neutral-400 mb-1">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span class="text-liver-red">CN</span>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-1 text-center text-xs">
              @for (blank of emptyDays; track $index) {
                <div></div>
              }
              @for (day of daysInMonth; track day) {
                <button
                  type="button"
                  (click)="selectDay(day)"
                  [class]="getDayClass(day)"
                  class="h-8 rounded-lg font-semibold transition-colors text-xs flex items-center justify-center"
                >
                  {{ day }}
                </button>
              }
            </div>

            <!-- Footer note & action -->
            <div class="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
              <span class="text-[10px] text-neutral-400">
                {{ selectingState === 'START' ? 'Bấm chọn ngày bắt đầu' : 'Bấm chọn ngày kết thúc' }}
              </span>
              <button
                type="button"
                (click)="closePopup()"
                class="px-3 py-1.5 rounded-lg bg-liver-red hover:bg-liver-redHover text-white text-xs font-bold transition-colors shadow-sm"
              >
                Xác nhận
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
export class DateRangeComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'DD/MM/YYYY - DD/MM/YYYY (gõ hoặc chọn lịch)...';
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;
  @Input() clearable = true;

  value: DateRangeValue = {
    startDate: '',
    endDate: ''
  };

  isOpen = false;
  selectingState: 'START' | 'END' = 'START';

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth(); // 0-indexed

  emptyDays: number[] = [];
  daysInMonth: number[] = [];

  onChange: (value: DateRangeValue) => void = () => {};
  onTouched: () => void = () => {};

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
    }
    return dateStr;
  }

  get displayValue(): string {
    if (this.value.startDate && this.value.endDate) {
      return `${this.formatDate(this.value.startDate)} - ${this.formatDate(this.value.endDate)}`;
    }
    if (this.value.startDate) {
      return `${this.formatDate(this.value.startDate)} - ...`;
    }
    return '';
  }

  get totalDays(): number {
    if (!this.value.startDate || !this.value.endDate) return 0;
    const d1 = new Date(this.value.startDate);
    const d2 = new Date(this.value.endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }

  constructor() {
    this.calculateCalendar();
  }

  writeValue(val: DateRangeValue): void {
    if (val && val.startDate && val.endDate) {
      this.value = { ...val };
      const parts = this.value.endDate.split('-');
      if (parts.length === 3) {
        this.currentYear = parseInt(parts[0], 10);
        this.currentMonth = parseInt(parts[1], 10) - 1;
        this.calculateCalendar();
      }
    } else {
      this.value = { startDate: '', endDate: '' };
    }
  }

  registerOnChange(fn: (value: DateRangeValue) => void): void {
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
    this.selectingState = 'START';
    this.calculateCalendar();
  }

  togglePopup(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.selectingState = 'START';
      this.calculateCalendar();
    }
  }

  closePopup(): void {
    this.isOpen = false;
  }

  clear(event?: Event): void {
    if (event) event.stopPropagation();
    this.value = { startDate: '', endDate: '' };
    this.selectingState = 'START';
    this.onChange({ ...this.value });
    this.onTouched();
  }

  onInputTyped(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim();
    if (!input) return;

    // Matches DD/MM/YYYY - DD/MM/YYYY or DD/MM/YYYY -> DD/MM/YYYY or DD/MM/YYYY to DD/MM/YYYY
    const match = input.match(
      /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\s*(?:-|>|->|to|\s)\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/i
    );
    if (match) {
      const d1 = parseInt(match[1], 10), m1 = parseInt(match[2], 10), y1 = parseInt(match[3], 10);
      const d2 = parseInt(match[4], 10), m2 = parseInt(match[5], 10), y2 = parseInt(match[6], 10);

      const startDateStr = `${y1}-${String(m1).padStart(2, '0')}-${String(d1).padStart(2, '0')}`;
      const endDateStr = `${y2}-${String(m2).padStart(2, '0')}-${String(d2).padStart(2, '0')}`;

      const t1 = new Date(startDateStr).getTime();
      const t2 = new Date(endDateStr).getTime();
      if (!isNaN(t1) && !isNaN(t2) && t1 <= t2) {
        this.value = { startDate: startDateStr, endDate: endDateStr };
        this.currentYear = y2;
        this.currentMonth = m2 - 1;
        this.calculateCalendar();
        this.onChange({ ...this.value });
      }
    }
  }

  onInputBlur(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.value.trim()) {
      this.clear();
    } else {
      inputEl.value = this.displayValue;
    }
    this.onTouched();
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

  calculateCalendar(): void {
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayIndex = (new Date(this.currentYear, this.currentMonth, 1).getDay() + 6) % 7;

    this.emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  selectDay(day: number): void {
    const monthStr = String(this.currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${this.currentYear}-${monthStr}-${dayStr}`;

    if (this.selectingState === 'START') {
      this.value.startDate = dateStr;
      if (new Date(this.value.startDate) > new Date(this.value.endDate)) {
        this.value.endDate = dateStr;
      }
      this.selectingState = 'END';
    } else {
      if (new Date(dateStr) < new Date(this.value.startDate)) {
        this.value.startDate = dateStr;
      } else {
        this.value.endDate = dateStr;
      }
      this.selectingState = 'START';
      this.onChange({ ...this.value });
      this.onTouched();
    }
  }

  setQuickRange(days: number): void {
    const end = new Date(2026, 9, 24);
    const start = new Date(end);
    start.setDate(end.getDate() - days + 1);

    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    this.value = {
      startDate: fmt(start),
      endDate: fmt(end)
    };
    this.currentYear = end.getFullYear();
    this.currentMonth = end.getMonth();
    this.selectingState = 'START';
    this.calculateCalendar();
    this.onChange({ ...this.value });
    this.onTouched();
  }

  getDayClass(day: number): string {
    const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const curr = new Date(dateStr).getTime();
    const start = new Date(this.value.startDate).getTime();
    const end = new Date(this.value.endDate).getTime();

    if (curr === start || curr === end) {
      return 'bg-liver-red text-white shadow font-bold';
    }
    if (curr > start && curr < end) {
      return 'bg-liver-redLight text-liver-red font-medium';
    }
    return 'hover:bg-neutral-900 hover:text-white text-liver-black';
  }
}
