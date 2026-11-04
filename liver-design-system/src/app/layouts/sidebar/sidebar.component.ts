import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MENU_ITEMS, MenuItem } from '../../core/constants/menu.constant';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <aside
      [class.w-64]="!isCollapsed"
      [class.w-20]="isCollapsed"
      class="bg-liver-black text-white flex flex-col justify-between transition-all duration-300 ease-in-out z-40 shrink-0 border-r border-neutral-800 select-none overflow-hidden h-screen"
    >
      <!-- Top Section: Brand & Nav -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <!-- Brand Logo LIVER -->
        <div class="h-16 flex items-center justify-between px-5 border-b border-neutral-800/80 bg-liver-dark shrink-0">
          <a routerLink="/" class="flex items-center gap-3 group">
            <app-logo [size]="40"></app-logo>
            @if (!isCollapsed) {
              <div class="sidebar-text truncate">
                <div class="flex items-center gap-1.5">
                  <span class="text-xl font-extrabold tracking-wider text-white">LIVER</span>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-liver-red text-white uppercase">Pro</span>
                </div>
                <p class="text-[10px] text-neutral-400 tracking-widest uppercase">Design System</p>
              </div>
            }
          </a>
        </div>

        <!-- Navigation Menu -->
        <div class="p-3 space-y-1 overflow-y-auto flex-1">
          @if (!isCollapsed) {
            <p class="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Main Navigation
            </p>
          }

          @for (item of menuItems; track item.id || item.label) {
            @if (item.children && item.children.length > 0) {
              <!-- Multilevel Submenu: {{ item.label }} -->
              <div>
                <button
                  type="button"
                  (click)="toggleSubmenu(item.id || item.label)"
                  class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all group"
                  [title]="isCollapsed ? item.label : ''"
                >
                  <div class="flex items-center gap-3">
                    @if (item.icon) {
                      <i [class]="item.icon + ' w-5 text-center group-hover:text-liver-red transition-colors shrink-0'"></i>
                    }
                    @if (!isCollapsed) {
                      <span class="text-sm">{{ item.label }}</span>
                    }
                  </div>
                  @if (!isCollapsed) {
                    <i
                      [class.rotate-180]="isSubmenuExpanded(item)"
                      class="fa-solid fa-chevron-down text-xs transition-transform duration-200"
                    ></i>
                  }
                </button>

                @if (!isCollapsed && isSubmenuExpanded(item)) {
                  <div class="mt-1 ml-4 pl-4 border-l border-neutral-800 space-y-1">
                    @for (child of item.children; track child.id || child.label) {
                      <a
                        [routerLink]="child.route"
                        [fragment]="child.fragment"
                        class="block px-3 py-1.5 rounded-md text-xs text-neutral-300 hover:text-liver-red transition-colors"
                      >
                        {{ child.label }}
                      </a>
                    }
                  </div>
                }
              </div>
            } @else if (item.route) {
              <!-- Standard Route Link Item -->
              <a
                [routerLink]="item.route"
                [fragment]="item.fragment"
                [routerLinkActive]="item.fragment ? '' : 'bg-liver-red text-white font-medium shadow-md shadow-liver-red/25'"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all group"
                [title]="isCollapsed ? item.label : ''"
              >
                <div class="flex items-center gap-3">
                  @if (item.icon) {
                    <i [class]="item.icon + ' w-5 text-center group-hover:text-liver-red transition-colors shrink-0'"></i>
                  }
                  @if (!isCollapsed) {
                    <span class="text-sm">{{ item.label }}</span>
                  }
                </div>
                @if (!isCollapsed && item.badge) {
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-liver-red border border-liver-redBorder">
                    {{ getBadgeText(item.badge) }}
                  </span>
                }
              </a>
            } @else {
              <!-- External or Action Link Item -->
              <a
                [href]="item.href || '#'"
                (click)="!item.href && $event.preventDefault()"
                class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all group"
                [title]="isCollapsed ? item.label : ''"
              >
                @if (item.icon) {
                  <i [class]="item.icon + ' w-5 text-center group-hover:text-liver-red transition-colors shrink-0'"></i>
                }
                @if (!isCollapsed) {
                  <span class="text-sm">{{ item.label }}</span>
                }
              </a>
            }
          }
        </div>
      </div>

      <!-- Sidebar Footer / Copyright Info -->
      <div class="p-3 border-t border-neutral-800 bg-liver-dark shrink-0">
        @if (!isCollapsed) {
          <div class="p-3 rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-900 to-liver-dark border border-neutral-800">
            <div class="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <span class="w-2 h-2 rounded-full bg-liver-red animate-pulse"></span>
              <span>LIVER SYSTEM v2.4</span>
            </div>
            <p class="text-[11px] text-neutral-400 truncate" title="copy by dvant24102003@gmail.com">
              copy by <span class="text-liver-red font-medium">dvant24102003@gmail.com</span>
            </p>
          </div>
        } @else {
          <div class="flex justify-center" title="LIVER SYSTEM v2.4 - dvant24102003@gmail.com">
            <span class="w-3 h-3 rounded-full bg-liver-red animate-pulse"></span>
          </div>
        }
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() menuItems: MenuItem[] = MENU_ITEMS;
  @Output() toggleCollapse = new EventEmitter<void>();

  openSubmenus: Record<string, boolean> = {
    components: true
  };

  get isSubmenuOpen(): boolean {
    return !!this.openSubmenus['components'];
  }

  set isSubmenuOpen(val: boolean) {
    this.openSubmenus['components'] = val;
  }

  toggleSubmenu(idOrLabel: string = 'components'): void {
    const key = idOrLabel || 'components';
    this.openSubmenus[key] = !this.openSubmenus[key];
  }

  isSubmenuExpanded(item: MenuItem): boolean {
    const key = item.id || item.label;
    if (this.openSubmenus[key] !== undefined) {
      return this.openSubmenus[key];
    }
    // Default open if not set
    return true;
  }

  getBadgeText(badge: MenuItem['badge']): string {
    if (!badge) return '';
    return typeof badge === 'string' ? badge : badge.text;
  }
}
