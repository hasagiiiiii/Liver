import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePalette, ThemePaletteService } from '../../core/services/theme-palette.service';
import { NotificationService } from '../../core/services/notification.service';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-theme-palette',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <div class="fixed bottom-6 right-6 z-50" (appClickOutside)="closeMenu()">
      <!-- Popover Menu -->
      @if (isOpen) {
        <div
          class="dropdown-animate absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-liver-redBorder/80 shadow-liver-red/15 p-4"
        >
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-palette text-liver-red text-sm"></i>
              <span class="text-xs font-extrabold uppercase tracking-wider text-liver-black">Theme Palette</span>
            </div>
            <button
              type="button"
              (click)="closeMenu()"
              class="w-6 h-6 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-liver-black flex items-center justify-center transition-colors"
            >
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>

          <p class="text-[11px] text-neutral-500 mb-3">Chọn bảng màu chủ đạo cho hệ thống LIVER:</p>

          <div class="space-y-2">
            @for (palette of palettes; track palette.id) {
              <button
                type="button"
                (click)="selectTheme(palette)"
                [ngClass]="{
                  'border-liver-red bg-liver-redLight shadow-sm': isSelected(palette.id),
                  'border-neutral-200 hover:border-neutral-400 bg-white': !isSelected(palette.id)
                }"
                class="w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all"
              >
                <div class="flex items-center gap-2.5">
                  <div class="flex items-center -space-x-1.5">
                    <span
                      class="w-4 h-4 rounded-full border border-white shadow-sm"
                      [style.backgroundColor]="palette.black"
                    ></span>
                    <span
                      class="w-4 h-4 rounded-full border border-white shadow-sm"
                      [style.backgroundColor]="palette.accent"
                    ></span>
                    <span
                      class="w-4 h-4 rounded-full border border-neutral-300 bg-white shadow-sm"
                    ></span>
                  </div>
                  <span class="text-xs font-bold text-liver-black">{{ palette.name }}</span>
                </div>

                @if (isSelected(palette.id)) {
                  <i class="fa-solid fa-circle-check text-liver-red text-sm"></i>
                }
              </button>
            }
          </div>
        </div>
      }

      <!-- Floating Trigger Button -->
      <button
        type="button"
        (click)="toggleMenu()"
        title="Cấu hình Theme Palette"
        class="w-12 h-12 rounded-full bg-liver-black hover:bg-liver-red text-white shadow-xl shadow-liver-red/35 hover:shadow-liver-red/50 border-2 border-white/90 group-hover:border-liver-red flex items-center justify-center transition-all duration-300 hover:scale-105 group"
      >
        <i class="fa-solid fa-gear text-lg group-hover:rotate-90 transition-transform duration-300"></i>
      </button>
    </div>
  `
})
export class ThemePaletteComponent {
  private readonly themeService = inject(ThemePaletteService);
  private readonly notificationService = inject(NotificationService);

  isOpen = false;
  readonly palettes = this.themeService.getPalettes();

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  isSelected(id: string): boolean {
    return this.themeService.getActiveThemeId() === id;
  }

  selectTheme(palette: ThemePalette): void {
    this.themeService.setTheme(palette.id);
    this.notificationService.show(`Đã đổi sang palette: ${palette.name}`, 'success');
  }
}
