import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-liver-red/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="dropdown-animate w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden relative z-10">
        <!-- Header -->
        <div class="bg-liver-black p-6 text-center text-white border-b-2 border-liver-red">
          <div class="flex justify-center mb-2">
            <app-logo [size]="40"></app-logo>
          </div>
          <h2 class="text-lg font-extrabold tracking-tight uppercase">
            Khôi Phục Mật Khẩu
          </h2>
          <p class="text-xs text-neutral-400 mt-1">
            Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        @if (!isEmailSent) {
          <!-- Reset Form -->
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="p-6 sm:p-8 space-y-4">
            <div>
              <app-input
                formControlName="email"
                type="email"
                label="Email đăng ký tài khoản"
                placeholder="VD: trung.do@liver.io"
                icon="fa-solid fa-envelope"
                [required]="true"
                [error]="isFieldInvalid('email') ? 'Vui lòng nhập định dạng email hợp lệ' : ''"
              ></app-input>
            </div>

            <button
              type="submit"
              [disabled]="forgotForm.invalid || isSubmitting"
              class="w-full py-2.5 px-4 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-liver-red/30 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSubmitting) {
                <i class="fa-solid fa-circle-notch animate-spin"></i>
                <span>Đang gửi hướng dẫn...</span>
              } @else {
                <i class="fa-solid fa-paper-plane"></i>
                <span>Gửi Yêu Cầu Khôi Phục</span>
              }
            </button>

            <div class="text-center pt-2">
              <a
                routerLink="/auth/login"
                class="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-liver-red font-semibold transition-colors"
              >
                <i class="fa-solid fa-arrow-left text-[11px]"></i>
                <span>Quay lại trang Đăng nhập</span>
              </a>
            </div>
          </form>
        } @else {
          <!-- Success Feedback State -->
          <div class="p-8 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center text-2xl shadow-inner">
              <i class="fa-solid fa-envelope-circle-check"></i>
            </div>

            <div class="space-y-1">
              <h3 class="text-sm font-bold text-liver-black">Đã gửi email khôi phục!</h3>
              <p class="text-xs text-neutral-500">
                Chúng tôi đã gửi hướng dẫn tới <b class="text-liver-black">{{ forgotForm.get('email')?.value }}</b>. Vui lòng kiểm tra hộp thư đến hoặc mục thư rác (Spam).
              </p>
            </div>

            <div class="pt-2 space-y-2">
              <button
                type="button"
                [disabled]="countdown > 0"
                (click)="resendEmail()"
                class="w-full py-2 px-4 rounded-xl border border-neutral-300 hover:border-liver-red hover:text-liver-red text-xs font-semibold text-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ countdown > 0 ? ('Gửi lại sau (' + countdown + 's)') : 'Gửi lại email' }}
              </button>

              <a
                routerLink="/auth/login"
                class="block w-full py-2 px-4 rounded-xl bg-liver-black text-white hover:bg-neutral-800 text-xs font-bold transition-colors text-center"
              >
                Về trang Đăng nhập
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ForgotPasswordComponent extends BaseComponent {
  private readonly authService = inject(AuthService);

  isEmailSent = false;
  countdown = 60;
  private timer: any;

  readonly forgotForm = this.fb.group({
    email: ['dvant24102003@gmail.com', [Validators.required, Validators.email]]
  });

  isFieldInvalid(name: string): boolean {
    const f = this.forgotForm.get(name);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.forgotForm.get('email')?.value || '';

    this.authService.sendForgotPassword(email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isEmailSent = true;
        this.startCountdown();
        this.showSuccess('Đã gửi email khôi phục thành công!');
      },
      error: () => {
        this.isSubmitting = false;
        this.showError('Có lỗi xảy ra khi gửi email khôi phục!');
      }
    });
  }

  resendEmail(): void {
    this.countdown = 60;
    this.startCountdown();
    this.showInfo('Đã gửi lại email hướng dẫn!');
  }

  private startCountdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
