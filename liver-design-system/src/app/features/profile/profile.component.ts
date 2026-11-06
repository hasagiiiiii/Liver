import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../shared/components/base/base.component';
import { TabsComponent, TabComponent } from '../../shared/components/tabs/tabs.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { FileUploadComponent, UploadFileItem } from '../../shared/components/file-upload/file-upload.component';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabsComponent,
    TabComponent,
    InputComponent,
    FileUploadComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Profile Header Banner -->
      <div class="bg-gradient-to-r from-liver-black via-liver-dark to-neutral-900 text-white rounded-2xl p-6 lg:p-8 shadow-xl border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="flex items-center gap-5 z-10">
          <!-- Avatar Initial Circle -->
          <div
            [style.backgroundColor]="currentUser()?.avatarBg || 'var(--liver-red)'"
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-white font-black text-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl shrink-0"
          >
            {{ currentUser()?.avatar || 'DT' }}
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black tracking-tight">
                {{ currentUser()?.fullName }}
              </h1>
              <span class="px-2.5 py-0.5 rounded-full bg-liver-red/20 border border-liver-red/40 text-liver-red text-xs font-bold uppercase">
                {{ currentUser()?.role }}
              </span>
            </div>
            <p class="text-xs text-neutral-400">
              &#64;{{ currentUser()?.username }} • {{ currentUser()?.email }}
            </p>
            <p class="text-[11px] text-neutral-500 font-medium">
              {{ currentUser()?.department || 'Khối Công Nghệ & Giải Pháp Phần Mềm' }}
            </p>
          </div>
        </div>

        <div class="z-10 flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Tài khoản đã xác minh
          </span>
        </div>

        <!-- Ambient decorative background -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-liver-red/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- Main Tabs Container Card -->
      <div class="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <app-tabs [(activeKey)]="activeTab" variant="line" size="md">
          <!-- Tab 1: Personal Info -->
          <app-tab id="general" label="Thông Tin Cá Nhân" icon="fa-solid fa-user-gear">
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-6 pt-2">
              <!-- Upload Avatar Section using app-file-upload -->
              <div class="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <app-file-upload
                  label="Thay đổi ảnh đại diện (Avatar)"
                  hint="Hỗ trợ ảnh JPG, PNG, WEBP (Tối đa 5MB)"
                  accept="image/*"
                  acceptDescription="Hình ảnh (.png, .jpg, .webp)"
                  [multiple]="false"
                  [maxFileSizeMb]="5"
                  (filesChange)="onAvatarChange($event)"
                ></app-file-upload>
              </div>

              <!-- Form Inputs Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <app-input
                  formControlName="fullName"
                  label="Họ và tên"
                  placeholder="Nhập họ và tên..."
                  icon="fa-solid fa-user"
                  [required]="true"
                ></app-input>

                <app-input
                  formControlName="username"
                  label="Username"
                  placeholder="Username..."
                  icon="fa-solid fa-at"
                ></app-input>

                <app-input
                  formControlName="email"
                  type="email"
                  label="Email liên hệ"
                  placeholder="Email..."
                  icon="fa-solid fa-envelope"
                  [required]="true"
                ></app-input>

                <app-input
                  formControlName="phone"
                  label="Số điện thoại"
                  placeholder="Số điện thoại..."
                  icon="fa-solid fa-phone"
                  [required]="true"
                ></app-input>

                <div class="md:col-span-2">
                  <app-input
                    formControlName="department"
                    label="Phòng ban / Đơn vị công tác"
                    placeholder="Phòng ban..."
                    icon="fa-solid fa-building"
                  ></app-input>
                </div>
              </div>

              <div class="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="submit"
                  [disabled]="profileForm.invalid || isSubmitting"
                  class="px-6 py-2.5 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-liver-red/25 transition-all disabled:opacity-50"
                >
                  @if (isSubmitting) {
                    <i class="fa-solid fa-circle-notch animate-spin"></i>
                  }
                  <span>Lưu Thông Tin Cá Nhân</span>
                </button>
              </div>
            </form>
          </app-tab>

          <!-- Tab 2: Security & Password -->
          <app-tab id="security" label="Đổi Mật Khẩu" icon="fa-solid fa-lock" badge="Bảo mật">
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4 max-w-lg pt-2">
              <app-input
                formControlName="currentPassword"
                type="password"
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại..."
                icon="fa-solid fa-key"
                [required]="true"
              ></app-input>

              <app-input
                formControlName="newPassword"
                type="password"
                label="Mật khẩu mới"
                placeholder="Tối thiểu 6 ký tự..."
                icon="fa-solid fa-lock"
                [required]="true"
              ></app-input>

              <!-- Password Strength Bar -->
              <div class="space-y-1">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-neutral-500">Độ mạnh mật khẩu:</span>
                  <span [class]="passwordStrengthTextClass" class="font-bold">{{ passwordStrengthText }}</span>
                </div>
                <div class="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                  <div [class]="strengthSegmentClass(1)" class="h-full flex-1 rounded-full transition-all"></div>
                  <div [class]="strengthSegmentClass(2)" class="h-full flex-1 rounded-full transition-all"></div>
                  <div [class]="strengthSegmentClass(3)" class="h-full flex-1 rounded-full transition-all"></div>
                </div>
              </div>

              <app-input
                formControlName="confirmPassword"
                type="password"
                label="Xác nhận mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới..."
                icon="fa-solid fa-shield-halved"
                [required]="true"
              ></app-input>

              <div class="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="submit"
                  [disabled]="passwordForm.invalid || isSubmitting"
                  class="px-6 py-2.5 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-liver-red/25 transition-all disabled:opacity-50"
                >
                  @if (isSubmitting) {
                    <i class="fa-solid fa-circle-notch animate-spin"></i>
                  }
                  <span>Cập Nhật Mật Khẩu</span>
                </button>
              </div>
            </form>
          </app-tab>

          <!-- Tab 3: 2FA & Sessions -->
          <app-tab id="sessions" label="Xác Thực 2FA & Thiết Bị" icon="fa-solid fa-shield-virus">
            <div class="space-y-6 pt-2">
              <!-- 2FA Toggle Card -->
              <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4">
                <div class="space-y-1">
                  <h4 class="text-xs font-bold text-liver-black uppercase tracking-wider">
                    Xác thực 2 bước qua mã OTP (2FA)
                  </h4>
                  <p class="text-[11px] text-neutral-500">
                    Bảo vệ tài khoản của bạn bằng cách yêu cầu mã xác thực bổ sung mỗi khi đăng nhập từ thiết bị lạ.
                  </p>
                </div>
                <button
                  type="button"
                  (click)="toggle2FA()"
                  [class.bg-liver-red]="is2FAEnabled"
                  [class.bg-neutral-300]="!is2FAEnabled"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    [class.translate-x-5]="is2FAEnabled"
                    [class.translate-x-0]="!is2FAEnabled"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                  ></span>
                </button>
              </div>

              <!-- Active Sessions Table -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-liver-black">
                    Phiên Đăng Nhập Hoạt Động (Active Sessions)
                  </h4>
                  <button
                    type="button"
                    (click)="revokeOtherSessions()"
                    class="text-xs font-bold text-liver-red hover:underline"
                  >
                    Đăng xuất các thiết bị khác
                  </button>
                </div>

                <div class="divide-y divide-neutral-100 rounded-xl border border-neutral-200 overflow-hidden">
                  @for (s of activeSessions; track s.id) {
                    <div class="p-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-neutral-100 text-liver-black flex items-center justify-center text-sm">
                          <i [class]="s.icon"></i>
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-liver-black">{{ s.device }}</span>
                            @if (s.isCurrent) {
                              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                                Thiết bị này
                              </span>
                            }
                          </div>
                          <p class="text-[11px] text-neutral-400">
                            {{ s.location }} • IP: {{ s.ip }} • {{ s.lastActive }}
                          </p>
                        </div>
                      </div>

                      @if (!s.isCurrent) {
                        <button
                          type="button"
                          (click)="revokeSession(s.id)"
                          class="px-2.5 py-1 rounded-lg border border-neutral-300 hover:border-liver-red hover:text-liver-red text-neutral-600 text-xs font-semibold transition-colors"
                        >
                          Đăng xuất
                        </button>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </app-tab>

          <!-- Tab 4: Role Sandbox for Testing Permissions -->
          <app-tab id="role-sandbox" label="Thử Nghiệm Phân Quyền (RBAC)" icon="fa-solid fa-users-gear" badge="Test">
            <div class="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4 pt-4">
              <div class="space-y-1">
                <h4 class="text-xs font-bold uppercase tracking-wider text-liver-black">
                  Chuyển đổi vai trò hiện tại (Role Sandbox)
                </h4>
                <p class="text-[11px] text-neutral-500">
                  Thử nghiệm trực tiếp hiệu ứng ẩn/hiện nút bấm bởi directive <code>*appHasPermission</code> mà không cần đăng xuất!
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  (click)="switchRole('ADMIN')"
                  [class.border-liver-red]="currentUser()?.role === 'ADMIN'"
                  [class.bg-liver-redLight]="currentUser()?.role === 'ADMIN'"
                  class="p-4 rounded-xl border-2 text-left transition-all hover:border-liver-red"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-liver-black">ADMIN</span>
                    @if (currentUser()?.role === 'ADMIN') {
                      <i class="fa-solid fa-circle-check text-liver-red"></i>
                    }
                  </div>
                  <p class="text-[11px] text-neutral-500 mt-1">
                    Toàn quyền (Thêm, Sửa, Xóa, Báo cáo, Cấu hình)
                  </p>
                </button>

                <button
                  type="button"
                  (click)="switchRole('MANAGER')"
                  [class.border-blue-600]="currentUser()?.role === 'MANAGER'"
                  [class.bg-blue-50]="currentUser()?.role === 'MANAGER'"
                  class="p-4 rounded-xl border-2 text-left transition-all hover:border-blue-600"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-liver-black">MANAGER</span>
                    @if (currentUser()?.role === 'MANAGER') {
                      <i class="fa-solid fa-circle-check text-blue-600"></i>
                    }
                  </div>
                  <p class="text-[11px] text-neutral-500 mt-1">
                    Quyền Quản lý (Xem, Thêm, Sửa - KHÔNG có quyền Xóa)
                  </p>
                </button>

                <button
                  type="button"
                  (click)="switchRole('DEVELOPER')"
                  [class.border-emerald-600]="currentUser()?.role === 'DEVELOPER'"
                  [class.bg-emerald-50]="currentUser()?.role === 'DEVELOPER'"
                  class="p-4 rounded-xl border-2 text-left transition-all hover:border-emerald-600"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-liver-black">DEVELOPER</span>
                    @if (currentUser()?.role === 'DEVELOPER') {
                      <i class="fa-solid fa-circle-check text-emerald-600"></i>
                    }
                  </div>
                  <p class="text-[11px] text-neutral-500 mt-1">
                    Chỉ xem dữ liệu (Ẩn toàn bộ nút Thêm & Xóa)
                  </p>
                </button>
              </div>
            </div>
          </app-tab>
        </app-tabs>
      </div>
    </div>
  `
})
export class ProfileComponent extends BaseComponent implements OnInit {
  private readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;

  activeTab = 'general';
  is2FAEnabled = false;

  readonly profileForm = this.fb.group({
    fullName: ['', Validators.required],
    username: [{ value: '', disabled: true }],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    department: ['']
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  activeSessions = [
    {
      id: 's-1',
      device: 'Google Chrome (macOS Sonoma)',
      ip: '113.161.45.88',
      location: 'Hà Nội, Việt Nam',
      lastActive: 'Đang hoạt động',
      icon: 'fa-solid fa-laptop',
      isCurrent: true
    },
    {
      id: 's-2',
      device: 'Mobile Safari (iPhone 15 Pro)',
      ip: '14.162.12.19',
      location: 'Hà Nội, Việt Nam',
      lastActive: '2 giờ trước',
      icon: 'fa-solid fa-mobile-screen',
      isCurrent: false
    }
  ];

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone || '0988123456',
        department: user.department || 'Khối Công Nghệ & Giải Pháp Phần Mềm'
      });
      this.is2FAEnabled = !!user.twoFactorEnabled;
    }
  }

  onAvatarChange(files: UploadFileItem[]): void {
    if (files.length > 0 && files[0].previewUrl) {
      this.authService.updateProfile({
        avatar: files[0].name.substring(0, 2).toUpperCase()
      });
      this.showSuccess('Đã cập nhật ảnh đại diện mới!');
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const val = this.profileForm.value;

    this.authService
      .updateProfile({
        fullName: val.fullName || '',
        email: val.email || '',
        phone: val.phone || '',
        department: val.department || ''
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccess('Cập nhật hồ sơ thành công!');
        },
        error: () => {
          this.isSubmitting = false;
          this.showError('Lỗi cập nhật thông tin');
        }
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.showError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    this.isSubmitting = true;
    this.authService.changePassword(currentPassword || '', newPassword || '').subscribe({
      next: () => {
        this.isSubmitting = false;
        this.passwordForm.reset();
        this.showSuccess('Đổi mật khẩu thành công!');
      },
      error: () => {
        this.isSubmitting = false;
        this.showError('Đổi mật khẩu thất bại!');
      }
    });
  }

  get passwordStrengthText(): string {
    const p = this.passwordForm.get('newPassword')?.value || '';
    if (!p) return 'Chưa nhập';
    if (p.length < 6) return 'Yếu';
    if (p.length < 10) return 'Trung bình';
    return 'Mạnh';
  }

  get passwordStrengthTextClass(): string {
    const s = this.passwordStrengthText;
    if (s === 'Mạnh') return 'text-emerald-600';
    if (s === 'Trung bình') return 'text-amber-600';
    return 'text-liver-red';
  }

  strengthSegmentClass(segment: number): string {
    const p = this.passwordForm.get('newPassword')?.value || '';
    if (!p) return 'bg-neutral-200';

    if (segment === 1) {
      return p.length >= 1 ? (p.length >= 6 ? (p.length >= 10 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-liver-red') : 'bg-neutral-200';
    }
    if (segment === 2) {
      return p.length >= 6 ? (p.length >= 10 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-neutral-200';
    }
    if (segment === 3) {
      return p.length >= 10 ? 'bg-emerald-500' : 'bg-neutral-200';
    }
    return 'bg-neutral-200';
  }

  toggle2FA(): void {
    this.is2FAEnabled = !this.is2FAEnabled;
    this.authService.updateProfile({ twoFactorEnabled: this.is2FAEnabled });
    this.showSuccess(
      this.is2FAEnabled
        ? 'Đã kích hoạt xác thực 2 bước (2FA)!'
        : 'Đã tắt xác thực 2 bước.'
    );
  }

  revokeSession(id: string): void {
    this.activeSessions = this.activeSessions.filter(s => s.id !== id);
    this.showSuccess('Đã đăng xuất phiên thiết bị!');
  }

  revokeOtherSessions(): void {
    this.activeSessions = this.activeSessions.filter(s => s.isCurrent);
    this.showSuccess('Đã đăng xuất toàn bộ thiết bị khác!');
  }

  switchRole(role: 'ADMIN' | 'MANAGER' | 'DEVELOPER'): void {
    this.authService.switchRole(role);
  }
}
