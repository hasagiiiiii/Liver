import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        @if (label) {
          <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
            {{ label }}
            @if (required) {
              <span class="text-liver-red">*</span>
            }
          </label>
        }
        @if (maxLength) {
          <span class="text-[11px] font-semibold text-neutral-500">
            {{ value.length }} / {{ maxLength }} ký tự
          </span>
        }
      </div>

      <textarea
        [rows]="rows"
        [maxLength]="maxLength"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onBlur()"
        class="w-full p-3.5 text-sm bg-white border border-neutral-300 hover:border-liver-red/60 rounded-lg focus:outline-none focus:border-liver-red focus:ring-2 focus:ring-liver-red/20 text-liver-black font-medium transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
      ></textarea>

      @if (hint) {
        <p class="text-[11px] text-neutral-500">{{ hint }}</p>
      }
    </div>
  `
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Nhập nội dung...';
  @Input() rows = 3;
  @Input() maxLength = 500;
  @Input() required = false;
  @Input() hint = '';
  @Input() disabled = false;

  value = '';

  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val || '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
