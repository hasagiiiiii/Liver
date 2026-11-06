import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerPlacement, DrawerService, DrawerSize } from '../../../core/services/drawer.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (computedIsOpen) {
      <div class="fixed inset-0 z-[90] !m-0 overflow-hidden">
        <!-- Backdrop -->
        @if (computedHasBackdrop) {
          <div
            (click)="onBackdropClick()"
            class="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300"
          ></div>
        }

        <!-- Drawer Content Panel -->
        <div
          [class]="getPlacementClasses()"
          [style]="getCustomSizeStyle()"
          class="fixed bg-white shadow-2xl flex flex-col z-[91] transition-transform duration-300 ease-out border-neutral-200"
        >
          <!-- Drawer Header -->
          <div class="px-6 py-4 bg-liver-black text-white flex items-center justify-between border-b-2 border-liver-red shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              @if (computedIcon) {
                <span class="w-8 h-8 rounded-lg bg-liver-red flex items-center justify-center text-xs shrink-0">
                  <i [class]="computedIcon"></i>
                </span>
              }
              <div class="truncate">
                <h3 class="text-sm font-bold uppercase tracking-wider truncate">
                  {{ computedTitle }}
                </h3>
                @if (computedSubtitle) {
                  <p class="text-[11px] text-neutral-400 truncate">
                    {{ computedSubtitle }}
                  </p>
                }
              </div>
            </div>

            <!-- Close Button -->
            <button
              type="button"
              (click)="close()"
              class="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors shrink-0"
              title="Đóng (Esc)"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Drawer Body (Scrollable) -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-liver-black">
            <!-- If template provided via service -->
            @if (serviceState().options?.template; as tpl) {
              <ng-container *ngTemplateOutlet="tpl; context: { $implicit: serviceState().options?.data }"></ng-container>
            } @else {
              <!-- Fallback to ng-content for declarative usage -->
              <ng-content></ng-content>
            }
          </div>

          <!-- Drawer Footer -->
          @if (showFooter || serviceState().options?.showFooter) {
            <div class="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
              <ng-content select="[drawer-footer]"></ng-content>
              <button
                type="button"
                (click)="close()"
                class="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold text-xs transition-colors"
              >
                {{ computedCancelText }}
              </button>
              <button
                type="button"
                (click)="onConfirm()"
                class="px-5 py-2 rounded-lg bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs transition-all shadow-md shadow-liver-red/25"
              >
                {{ computedConfirmText }}
              </button>
            </div>
          } @else {
            <!-- Custom declarative footer container if projected -->
            <div class="empty:hidden">
              <ng-content select="[drawer-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class DrawerComponent {
  private readonly drawerService = inject(DrawerService);
  readonly serviceState = this.drawerService.state;

  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() title = 'Chi tiết';
  @Input() subtitle = '';
  @Input() icon = 'fa-solid fa-sliders';
  @Input() placement: DrawerPlacement = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() hasBackdrop = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEsc = true;
  @Input() showFooter = false;
  @Input() confirmText = 'Lưu thay đổi';
  @Input() cancelText = 'Đóng';

  @Output() onClosed = new EventEmitter<any>();
  @Output() onConfirmed = new EventEmitter<void>();

  get computedIsOpen(): boolean {
    return this.isOpen || this.serviceState().isOpen;
  }

  get computedTitle(): string {
    return this.serviceState().options?.title || this.title;
  }

  get computedSubtitle(): string {
    return this.serviceState().options?.subtitle || this.subtitle;
  }

  get computedIcon(): string {
    return this.serviceState().options?.icon || this.icon;
  }

  get computedPlacement(): DrawerPlacement {
    return this.serviceState().options?.placement || this.placement;
  }

  get computedSize(): DrawerSize {
    return this.serviceState().options?.size || this.size;
  }

  get computedHasBackdrop(): boolean {
    return this.serviceState().options?.hasBackdrop ?? this.hasBackdrop;
  }

  get computedCloseOnBackdropClick(): boolean {
    return this.serviceState().options?.closeOnBackdropClick ?? this.closeOnBackdropClick;
  }

  get computedConfirmText(): string {
    return this.serviceState().options?.confirmText || this.confirmText;
  }

  get computedCancelText(): string {
    return this.serviceState().options?.cancelText || this.cancelText;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    const escEnabled = this.serviceState().options?.closeOnEsc ?? this.closeOnEsc;
    if (this.computedIsOpen && escEnabled) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.computedCloseOnBackdropClick) {
      this.close();
    }
  }

  close(result?: any): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.drawerService.close(result);
    this.onClosed.emit(result);
  }

  onConfirm(): void {
    this.onConfirmed.emit();
  }

  getPlacementClasses(): string {
    const p = this.computedPlacement;
    const s = this.computedSize;

    switch (p) {
      case 'right':
        return `top-0 right-0 bottom-0 border-l ${this.getWidthClass(s)}`;
      case 'left':
        return `top-0 left-0 bottom-0 border-r ${this.getWidthClass(s)}`;
      case 'top':
        return `top-0 left-0 right-0 border-b ${this.getHeightClass(s)}`;
      case 'bottom':
        return `bottom-0 left-0 right-0 border-t ${this.getHeightClass(s)}`;
      default:
        return `top-0 right-0 bottom-0 border-l ${this.getWidthClass(s)}`;
    }
  }

  private getWidthClass(size: DrawerSize): string {
    switch (size) {
      case 'sm':
        return 'w-full sm:w-80';
      case 'md':
        return 'w-full sm:w-[480px]';
      case 'lg':
        return 'w-full sm:w-[640px]';
      case 'xl':
        return 'w-full sm:w-[820px]';
      case 'full':
        return 'w-full';
      default:
        return size.includes('px') || size.includes('%') ? '' : 'w-full sm:w-[480px]';
    }
  }

  private getHeightClass(size: DrawerSize): string {
    switch (size) {
      case 'sm':
        return 'h-64';
      case 'md':
        return 'h-96';
      case 'lg':
        return 'h-[500px]';
      case 'xl':
        return 'h-[700px]';
      case 'full':
        return 'h-full';
      default:
        return size.includes('px') || size.includes('%') ? '' : 'h-96';
    }
  }

  getCustomSizeStyle(): { [key: string]: string } {
    const s = this.computedSize;
    const p = this.computedPlacement;

    if (s.includes('px') || s.includes('%') || s.includes('rem') || s.includes('vw')) {
      if (p === 'left' || p === 'right') {
        return { width: s };
      }
      return { height: s };
    }
    return {};
  }
}
