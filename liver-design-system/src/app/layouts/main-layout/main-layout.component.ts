import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThemePaletteComponent } from '../theme-palette/theme-palette.component';
import { DrawerComponent } from '../../shared/components/drawer/drawer.component';
import { NotificationService } from '../../core/services/notification.service';
import { ApiService } from '../../core/services/api.service';
import { ModalService } from '../../core/services/modal.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ThemePaletteComponent, DrawerComponent],
  template: `
    <!-- Global Drawer Slide-over -->
    <app-drawer></app-drawer>

    <!-- Toast Notification Container -->
    <div class="fixed top-20 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      @for (toast of toasts(); track toast.id) {
        <div
          class="dropdown-animate pointer-events-auto px-4 py-3 rounded-xl bg-liver-black text-white border border-neutral-700 shadow-2xl flex items-center gap-3 text-xs min-w-[280px]"
        >
          @if (toast.type === 'success') {
            <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-circle-check"></i>
            </span>
          } @else if (toast.type === 'error') {
            <span class="w-6 h-6 rounded-full bg-liver-red/20 text-liver-red flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </span>
          } @else {
            <span class="w-6 h-6 rounded-full bg-liver-red flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-bell"></i>
            </span>
          }
          <div class="flex-1 font-medium">{{ toast.message }}</div>
          <button
            type="button"
            (click)="closeToast(toast.id)"
            class="text-neutral-400 hover:text-white transition-colors"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      }
    </div>

    <!-- Floating Theme Palette Switcher -->
    <app-theme-palette></app-theme-palette>

    <!-- Global Confirm Modal Dialog (Root Level) -->
    @if (modalState().isOpen && modalState().options; as opt) {
      <div class="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div
          [class.border-liver-redBorder]="opt.variant === 'danger'"
          [class.shadow-liver-red/15]="opt.variant === 'danger'"
          class="dropdown-animate bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden p-6 text-center space-y-4"
        >
          <div
            [ngClass]="{
              'bg-liver-redLight text-liver-red border border-liver-redBorder': opt.variant === 'danger',
              'bg-amber-100 text-amber-600': opt.variant === 'warning',
              'bg-blue-100 text-blue-600': opt.variant === 'info',
              'bg-emerald-100 text-emerald-600': opt.variant === 'success'
            }"
            class="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-xl shadow-inner"
          >
            <i [class]="opt.icon || (opt.variant === 'danger' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-question')"></i>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-liver-black">{{ opt.title }}</h3>
            <p class="text-xs text-neutral-500">{{ opt.message }}</p>
            @if (opt.subMessage) {
              <p class="text-[11px] text-neutral-400">{{ opt.subMessage }}</p>
            }
          </div>

          <div class="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              (click)="onModalCancel()"
              class="flex-1 py-2 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold text-xs transition-colors"
            >
              {{ opt.cancelText || 'Hủy bỏ' }}
            </button>
            <button
              type="button"
              (click)="onModalConfirm()"
              [ngClass]="{
                'bg-liver-red hover:bg-liver-redHover': opt.variant === 'danger',
                'bg-amber-600 hover:bg-amber-700': opt.variant === 'warning',
                'bg-blue-600 hover:bg-blue-700': opt.variant === 'info',
                'bg-emerald-600 hover:bg-emerald-700': opt.variant === 'success'
              }"
              class="flex-1 py-2 px-4 rounded-xl text-white font-bold text-xs transition-all shadow-md"
            >
              {{ opt.confirmText || 'Xác nhận' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Main App Container -->
    <div class="flex h-screen w-screen overflow-hidden relative">
      <!-- Fixed Sidebar Toggle Button (Chevron Left / Right) -->
      <button
        type="button"
        (click)="toggleSidebar()"
        [style.left.px]="isSidebarCollapsed ? 68 : 244"
        class="fixed top-5 z-50 w-6 h-6 rounded-full bg-liver-black hover:bg-liver-red text-white flex items-center justify-center shadow-md shadow-liver-red/20 hover:shadow-liver-red/40 border border-neutral-700 hover:border-liver-red transition-all duration-300 text-xs hover:scale-110 cursor-pointer"
        [title]="isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'"
      >
        <i [class]="isSidebarCollapsed ? 'fa-solid fa-chevron-right text-[10px]' : 'fa-solid fa-chevron-left text-[10px]'"></i>
      </button>

      <!-- Collapsible Sidebar -->
      <app-sidebar [isCollapsed]="isSidebarCollapsed" (toggleCollapse)="toggleSidebar()"></app-sidebar>

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <!-- Header (Integrated Breadcrumb) -->
        <header class="h-16 bg-white border-b border-neutral-200 px-4 lg:px-8 flex items-center justify-between shrink-0 z-30 shadow-sm">
          <!-- Left Header: Breadcrumb Nav -->
          <div class="flex items-center gap-4">
            <!-- Integrated Breadcrumb Nav -->
            <nav aria-label="Breadcrumb" class="flex items-center text-xs font-medium">
              <ol class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <li>
                  <a routerLink="/" class="text-neutral-500 hover:text-liver-red flex items-center gap-1.5 transition-colors">
                    <i class="fa-solid fa-house text-liver-red"></i>
                    <span class="hidden sm:inline">Trang chủ</span>
                  </a>
                </li>
                <li class="text-neutral-300">/</li>
                <li class="hidden md:block">
                  <span class="text-neutral-500">LIVER System</span>
                </li>
                <li class="hidden md:block text-neutral-300">/</li>
                <li class="hidden sm:block">
                  <span class="text-neutral-500">UI Components</span>
                </li>
                <li class="hidden sm:block text-neutral-300">/</li>
                <li class="text-liver-black font-bold bg-liver-redLight text-liver-red px-2.5 py-1 rounded-md border border-liver-redBorder">
                  {{ currentBreadcrumbTitle }}
                </li>
              </ol>
            </nav>
          </div>

          <!-- Right Header: Quick Actions & Profile -->
          <div class="flex items-center gap-3">
            <!-- Reset Controls Demo Button -->
            <button
              type="button"
              (click)="onResetControls()"
              class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-liver-black hover:border-liver-red hover:text-liver-red transition-colors"
            >
              <i class="fa-solid fa-rotate-left"></i>
              <span>Reset Controls</span>
            </button>

            <!-- Notification Bell -->
            <button
              type="button"
              (click)="showDemoNotification()"
              class="relative w-9 h-9 rounded-lg border border-neutral-200 hover:border-liver-red text-liver-black hover:text-liver-red flex items-center justify-center transition-colors"
              title="Thông báo hệ thống"
            >
              <i class="fa-regular fa-bell"></i>
              <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-liver-red text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            <!-- User Profile Display & Quick Actions -->
            <div class="flex items-center gap-2 pl-2 border-l border-neutral-200">
              <a
                routerLink="/profile"
                class="flex items-center gap-2.5 p-1 rounded-xl hover:bg-neutral-100 transition-colors group cursor-pointer"
                title="Xem hồ sơ cá nhân"
              >
                <div
                  [style.backgroundColor]="currentUser()?.avatarBg || 'var(--liver-red)'"
                  class="w-9 h-9 rounded-lg text-white font-bold text-xs flex items-center justify-center border-2 border-liver-red shadow-sm group-hover:scale-105 transition-transform"
                >
                  {{ currentUser()?.avatar || 'DT' }}
                </div>
                <div class="hidden xl:block text-left">
                  <p class="text-xs font-bold text-liver-black leading-none group-hover:text-liver-red transition-colors">
                    {{ currentUser()?.fullName || 'Dvant Admin' }}
                  </p>
                  <p class="text-[11px] text-neutral-400 font-medium mt-0.5">
                    {{ currentUser()?.role || 'ADMIN' }}
                  </p>
                </div>
              </a>

              <!-- Logout Button -->
              <button
                type="button"
                (click)="onLogout()"
                class="w-9 h-9 rounded-lg border border-neutral-200 hover:border-liver-red hover:bg-liver-redLight text-neutral-500 hover:text-liver-red flex items-center justify-center transition-colors"
                title="Đăng xuất khỏi hệ thống"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Scrollable Content Viewport -->
        <main class="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          <router-outlet></router-outlet>

          <!-- Footer -->
          <footer class="bg-liver-black text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border border-neutral-800">
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded bg-liver-red flex items-center justify-center font-extrabold text-xs">
                L
              </div>
              <span class="text-xs font-bold tracking-wider">LIVER ADMIN SYSTEM</span>
            </div>
            <div class="text-xs text-neutral-400">
              Designed & Built with Black-Red-White Theme •
              <span class="text-white font-semibold">
                copy by <span class="text-liver-red">dvant24102003&#64;gmail.com</span>
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly apiService = inject(ApiService);
  private readonly modalService = inject(ModalService);
  private readonly authService = inject(AuthService);

  isSidebarCollapsed = false;
  readonly toasts = this.notificationService.toasts;
  readonly modalState = this.modalService.state;
  readonly currentUser = this.authService.currentUser;

  onLogout(): void {
    this.authService.logout();
  }

  onModalConfirm(): void {
    this.modalService.handleConfirm();
  }

  onModalCancel(): void {
    this.modalService.handleCancel();
  }

  get currentBreadcrumbTitle(): string {
    const url = this.router.url;
    if (url.includes('/users')) return 'Quản Lý Người Dùng';
    if (url.includes('/analytics')) return 'Báo Cáo & Phân Tích';
    if (url.includes('/profile')) return 'Hồ Sơ Cá Nhân & Bảo Mật';
    return 'Form Controls & Data Table';
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeToast(id: string): void {
    this.notificationService.remove(id);
  }

  onResetControls(): void {
    this.apiService.resetProjects();
    this.notificationService.show('Đã khôi phục cài đặt mặc định cho dữ liệu bảng!', 'info');
    // Dispatch custom window event so active forms can reset
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('liver:reset-controls'));
    }
  }

  showDemoNotification(): void {
    this.notificationService.show('Hệ thống có 3 thông báo mới từ Core Banking!', 'info');
  }
}
