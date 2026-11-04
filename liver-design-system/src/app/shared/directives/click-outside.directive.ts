import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output('appClickOutside') appClickOutside = new EventEmitter<Event | undefined>();
  @Output() clickOutside = new EventEmitter<Event | undefined>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentEvent(event: MouseEvent | TouchEvent): void {
    const target = event.target as Node;
    if (!target) return;

    // Check if the click or touch occurred inside the host element
    const clickedInside = event.composedPath
      ? event.composedPath().includes(this.elementRef.nativeElement)
      : this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.appClickOutside.emit(event);
      this.clickOutside.emit(event);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event?: Event): void {
    this.appClickOutside.emit(event);
    this.clickOutside.emit(event);
  }
}
