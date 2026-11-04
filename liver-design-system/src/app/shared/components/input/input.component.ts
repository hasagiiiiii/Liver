import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
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

      <div class="relative">
        @if (icon) {
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400 pointer-events-none">
            <i [class]="icon + ' text-xs'"></i>
          </span>
        }

        <input
          #inputEl
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          [class.pl-9]="!!icon"
          [class.pl-3.5]="!icon"
          [ngClass]="{
            'border-liver-red bg-liver-redLight/30 focus:border-liver-red focus:ring-liver-red/20': !!error,
            'border-neutral-300 hover:border-liver-red focus:border-liver-red focus:ring-liver-red/20': !error
          }"
          class="w-full pr-8 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 text-liver-black font-medium transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
        />

        @if (clearable && value && !disabled) {
          <button
            type="button"
            (click)="clear(inputEl)"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-liver-red transition-colors"
            title="Xóa nhanh"
          >
            <i class="fa-solid fa-circle-xmark text-xs"></i>
          </button>
        }
      </div>

      @if (error) {
        <p class="text-[10px] text-liver-red font-semibold">{{ error }}</p>
      } @else if (hint) {
        <p class="text-[11px] text-neutral-500">{{ hint }}</p>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() icon = '';
  @Input() clearable = true;
  @Input() required = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() disabled = false;

  value = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val || '';
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

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  clear(inputEl: HTMLInputElement): void {
    this.value = '';
    this.onChange(this.value);
    inputEl.focus();
  }
}
