import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMask]',
  standalone: true
})
export class MaskDirective {
  @Input('appMask') maskType: 'number' | 'currency' | 'none' = 'none';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (this.maskType === 'none') return;

    const input = this.el.nativeElement;
    const originalValue = input.value;

    if (this.maskType === 'number') {
      const sanitized = originalValue.replace(/[^\d]/g, '');
      if (sanitized !== originalValue) {
        input.value = sanitized;
      }
    }
  }
}
