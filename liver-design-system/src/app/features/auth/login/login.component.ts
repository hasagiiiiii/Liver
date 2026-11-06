import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LogoComponent,
    InputComponent
  ],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-liver-black via-liver-dark to-neutral-900 relative overflow-hidden select-none">
      <!-- Ambient Theme Glow Backgrounds -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-liver-red/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-liver-red/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Login Container Card -->
      <div class="dropdown-animate w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden relative z-10">
        <!-- Top Tech Gradient Header -->
        <div class="bg-liver-black p-6 sm:p-8 text-center text-white border-b-2 border-liver-red relative">
          <!-- Logo Component -->
          <div class="flex justify-center mb-3">
            <app-logo [size]="44"></app-logo>
          </div>
          <h2 class="text-xl font-extrabold tracking-tight uppercase">
            LIVER <span class="text-liver-red">Enterprise</span>
          </h2>
          <p class="text-xs text-neutral-400 mt-1">
            Đăng nhập vào cổng điều hành và quản trị dữ liệu tập trung
          </p>
        </div>

        <!-- Form Body -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="p-6 sm:p-8 space-y-4">
          <!-- Username / Email Field -->
          <div>
            <app-input
              formControlName="username"
              label="Tên đăng nhập / Email"
              placeholder="Nhập tên đăng nhập hoặc email..."
              icon="fa-solid fa-user"
              [required]="true"
              [error]="isFieldInvalid('username') ? 'Tên đăng nhập không được để trống' : ''"
            ></app-input>
          </div>

          <!-- Password Field with Toggle Eye -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold uppercase tracking-wider text-liver-black">
                Mật khẩu <span class="text-liver-red">*</span>
              </label>
              <a
                routerLink="/auth/forgot-password"
                class="text-[11px] font-semibold text-liver-red hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            <div class="relative">
              <app-input
                formControlName="password"
                [type]="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu truy cập..."
                icon="fa-solid fa-lock"
                [required]="true"
                [error]="isFieldInvalid('password') ? 'Mật khẩu là bắt buộc' : ''"
              ></app-input>
              <button
                type="button"
                (click)="showPassword = !showPassword"
                class="absolute right-3 top-2.5 text-neutral-400 hover:text-liver-black text-xs transition-colors"
                title="Ẩn / Hiện mật khẩu"
              >
                <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Remember Me & Policy -->
          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 font-medium select-none">
              <input
                type="checkbox"
                formControlName="rememberMe"
                class="w-4 h-4 rounded border-neutral-300 text-liver-red focus:ring-liver-red/30 accent-liver-red cursor-pointer"
              />
              <span>Ghi nhớ đăng nhập (30 ngày)</span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              type="submit"
              [disabled]="loginForm.invalid || isSubmitting"
              class="w-full py-3 px-4 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-liver-red/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSubmitting) {
                <i class="fa-solid fa-circle-notch animate-spin"></i>
                <span>Đang xác thực tài khoản...</span>
              } @else {
                <i class="fa-solid fa-right-to-bracket"></i>
                <span>Đăng Nhập Vào Hệ Thống</span>
              }
            </button>
          </div>

          <!-- Demo Quick Switcher -->
          <div class="pt-4 border-t border-neutral-100">
            <p class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-center mb-2">
              Tài khoản mẫu đăng nhập nhanh (Quick Demo)
            </p>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                (click)="fillDemo('trungdv', 'admin123')"
                class="py-1.5 px-2 rounded-lg bg-neutral-100 hover:bg-liver-redLight hover:text-liver-red border border-neutral-200 text-[10px] font-bold text-neutral-700 transition-colors text-center"
              >
                ADMIN
              </button>
              <button
                type="button"
                (click)="fillDemo('namnv_manager', 'mgr123')"
                class="py-1.5 px-2 rounded-lg bg-neutral-100 hover:bg-blue-50 hover:text-blue-600 border border-neutral-200 text-[10px] font-bold text-neutral-700 transition-colors text-center"
              >
                MANAGER
              </button>
              <button
                type="button"
                (click)="fillDemo('phuongtt_dev', 'dev123')"
                class="py-1.5 px-2 rounded-lg bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-600 border border-neutral-200 text-[10px] font-bold text-neutral-700 transition-colors text-center"
              >
                DEVELOPER
              </button>
            </div>
          </div>
        </form>

        <!-- Card Footer -->
        <div class="px-6 py-3 bg-neutral-50 border-t border-neutral-100 text-center text-[11px] text-neutral-400">
          Hệ thống bảo mật Enterprise Shield • Chuẩn mã hóa SSL 256-bit
        </div>
      </div>
    </div>
  `
})
export class LoginComponent extends BaseComponent implements OnInit {
  private readonly authService = inject(AuthService);

  showPassword = false;
  returnUrl = '/dashboard';

  readonly loginForm = this.fb.group({
    username: ['trungdv', [Validators.required, Validators.minLength(3)]],
    password: ['admin123', [Validators.required, Validators.minLength(4)]],
    rememberMe: [true]
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams['returnUrl'];
    if (q) {
      this.returnUrl = q;
    }
  }

  fillDemo(user: string, pass: string): void {
    this.loginForm.patchValue({
      username: user,
      password: pass
    });
  }

  isFieldInvalid(name: string): boolean {
    const f = this.loginForm.get(name);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { username, password, rememberMe } = this.loginForm.value;

    this.authService
      .login({
        username: username || '',
        password: password || '',
        rememberMe: !!rememberMe
      })
      .subscribe({
        next: user => {
          this.isSubmitting = false;
          this.showSuccess(`Đăng nhập thành công! Chào mừng ${user.fullName}`);
          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => {
          this.isSubmitting = false;
          this.showError('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        }
      });
  }
}
