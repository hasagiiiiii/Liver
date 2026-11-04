import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipEl: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipText) return;
    this.createTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroyTooltip();
  }

  private createTooltip(): void {
    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.appendChild(
      this.tooltipEl,
      this.renderer.createText(this.tooltipText)
    );

    this.renderer.addClass(this.tooltipEl, 'fixed');
    this.renderer.addClass(this.tooltipEl, 'z-[9999]');
    this.renderer.addClass(this.tooltipEl, 'px-2.5');
    this.renderer.addClass(this.tooltipEl, 'py-1');
    this.renderer.addClass(this.tooltipEl, 'text-xs');
    this.renderer.addClass(this.tooltipEl, 'font-semibold');
    this.renderer.addClass(this.tooltipEl, 'text-white');
    this.renderer.addClass(this.tooltipEl, 'bg-neutral-900');
    this.renderer.addClass(this.tooltipEl, 'rounded-md');
    this.renderer.addClass(this.tooltipEl, 'shadow-lg');
    this.renderer.addClass(this.tooltipEl, 'pointer-events-none');
    this.renderer.addClass(this.tooltipEl, 'whitespace-nowrap');
    this.renderer.addClass(this.tooltipEl, 'border');
    this.renderer.addClass(this.tooltipEl, 'border-neutral-700');

    this.renderer.appendChild(document.body, this.tooltipEl);

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipEl!.getBoundingClientRect();

    let top = 0;
    let left = 0;

    if (this.tooltipPosition === 'top') {
      top = hostPos.top - tooltipPos.height - 6;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    } else if (this.tooltipPosition === 'bottom') {
      top = hostPos.bottom + 6;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    } else if (this.tooltipPosition === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - 6;
    } else {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + 6;
    }

    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${Math.max(8, left)}px`);
  }

  private destroyTooltip(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
