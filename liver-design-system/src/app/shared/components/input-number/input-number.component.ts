import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CurrencyVNDPipe } from '../../pipes/currency-vnd.pipe';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1.5">
      @if (label) {
        <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
          {{ label }}
          @if (required) {
            <span class="text-liver-red">*</span>
          }
        </label>
      }

      <div class="flex items-center">
        <button
          type="button"
          (click)="stepValue(-step)"
          [disabled]="disabled || (min !== undefined && value <= min)"
          class="h-[42px] px-3.5 bg-liver-black hover:bg-liver-red border border-liver-black hover:border-liver-redHover text-white rounded-l-lg transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          title="Giảm"
        >
          <i class="fa-solid fa-minus text-xs"></i>
        </button>

        <div class="relative flex-1">
          <input
            type="number"
            [min]="min ?? null"
            [max]="max ?? null"
            [step]="step"
            [disabled]="disabled"
            [value]="value"
            (input)="onInputChange($event)"
            (blur)="onBlur()"
            class="w-full h-[42px] px-3 text-center text-sm font-bold bg-white border-y border-neutral-300 hover:border-liver-red/60 focus:outline-none focus:border-liver-red focus:ring-1 focus:ring-liver-red/20 text-liver-black disabled:bg-neutral-100 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <button
          type="button"
          (click)="stepValue(step)"
          [disabled]="disabled || (max !== undefined && value >= max)"
          class="h-[42px] px-3.5 bg-liver-black hover:bg-liver-red border border-liver-black hover:border-liver-redHover text-white rounded-r-lg transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          title="Tăng"
        >
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>

      <div class="flex justify-between text-[11px]">
        <span class="text-neutral-500">{{ hint || 'Định dạng tiền tệ:' }}</span>
        <span class="font-bold text-liver-red">{{ value | currencyVND }}</span>
      </div>
    </div>
  `,
  styles: [`
    /* Ẩn nút spin (tăng/giảm plus/minus mặc định của trình duyệt) khi hover vào input type=number */
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type='number'] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  `]
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() min: number | undefined = 0;
  @Input() max: number | undefined = undefined;
  @Input() step = 1;
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;

  value = 0;

  onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: number): void {
    if (val !== undefined && val !== null) {
      this.value = Number(val);
    } else {
      this.value = 0;
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    let num = parseInt(target.value, 10);
    if (isNaN(num)) num = 0;
    if (this.min !== undefined && num < this.min) num = this.min;
    if (this.max !== undefined && num > this.max) num = this.max;
    this.value = num;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  stepValue(delta: number): void {
    if (this.disabled) return;
    let next = (this.value || 0) + delta;
    if (this.min !== undefined && next < this.min) next = this.min;
    if (this.max !== undefined && next > this.max) next = this.max;
    this.value = next;
    this.onChange(this.value);
    this.onTouched();
  }
}
