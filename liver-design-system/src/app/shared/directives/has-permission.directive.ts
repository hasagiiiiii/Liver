import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  Renderer2,
  effect,
  inject
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<any>, { optional: true });
  private readonly viewContainer = inject(ViewContainerRef, { optional: true });
  private readonly elementRef = inject(ElementRef, { optional: true });
  private readonly renderer = inject(Renderer2);

  private requiredPermissions: string | string[] = [];
  private mode: 'any' | 'all' = 'any';
  private disabledMode = false;
  private isRendered = false;

  @Input('appHasPermission')
  set permissions(value: string | string[]) {
    this.requiredPermissions = value;
    this.updateView();
  }

  @Input('appHasPermissionMode')
  set permissionMode(value: 'any' | 'all') {
    this.mode = value || 'any';
    this.updateView();
  }

  @Input('appHasPermissionDisabled')
  set isDisabledMode(value: boolean) {
    this.disabledMode = value;
    this.updateView();
  }

  constructor() {
    // Automatically re-evaluate whenever user changes role or permissions
    effect(() => {
      // Track currentUser signal
      this.authService.currentUser();
      this.updateView();
    });
  }

  private updateView(): void {
    const hasAccess = this.authService.hasPermission(this.requiredPermissions, this.mode);

    // Mode 1: Disabled mode (keep in DOM but disable element)
    if (this.disabledMode && this.elementRef) {
      const nativeEl = this.elementRef.nativeElement;
      if (hasAccess) {
        this.renderer.removeAttribute(nativeEl, 'disabled');
        this.renderer.removeClass(nativeEl, 'opacity-40');
        this.renderer.removeClass(nativeEl, 'cursor-not-allowed');
        this.renderer.removeAttribute(nativeEl, 'title');
      } else {
        this.renderer.setAttribute(nativeEl, 'disabled', 'true');
        this.renderer.addClass(nativeEl, 'opacity-40');
        this.renderer.addClass(nativeEl, 'cursor-not-allowed');
        this.renderer.setAttribute(
          nativeEl,
          'title',
          'Bạn không có quyền thực hiện thao tác này'
        );
      }
      return;
    }

    // Mode 2: Structural directive mode (add/remove from DOM via templateRef)
    if (this.viewContainer && this.templateRef) {
      if (hasAccess && !this.isRendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isRendered = true;
      } else if (!hasAccess && this.isRendered) {
        this.viewContainer.clear();
        this.isRendered = false;
      }
    }
  }
}
