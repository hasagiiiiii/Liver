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
        <button
          type="button"
          (click)="togglePopup()"
          [disabled]="disabled"
          [class.border-liver-red]="isOpen"
          class="w-full h-[42px] px-3.5 text-sm bg-white border border-neutral-300 hover:border-liver-red/60 focus:border-liver-red rounded-lg flex items-center justify-between text-liver-black font-medium transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
        >
          <div class="flex items-center gap-2 truncate">
            <i class="fa-solid fa-calendar-week text-liver-red"></i>
            @if (value.startDate && value.endDate) {
              <span class="font-semibold">{{ value.startDate | dateFormat }}</span>
              <i class="fa-solid fa-arrow-right text-[10px] text-liver-red mx-0.5"></i>
              <span class="font-semibold">{{ value.endDate | dateFormat }}</span>
            } @else {
              <span class="text-neutral-400 font-normal">{{ placeholder }}</span>
            }
          </div>

          <div class="flex items-center gap-2 shrink-0">
            @if (value.startDate && value.endDate) {
              <span class="px-2 py-0.5 rounded-full bg-liver-redLight text-liver-red border border-liver-redBorder text-[10px] font-bold">
                {{ totalDays }} ngày
              </span>
            }
            <i class="fa-solid fa-chevron-down text-xs text-neutral-400"></i>
          </div>
        </button>

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
  @Input() placeholder = 'Chọn khoảng thời gian...';
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;

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
