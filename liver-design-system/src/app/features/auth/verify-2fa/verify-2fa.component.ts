import { Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-2fa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LogoComponent],
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
            Xác Thực Hai Lớp (2FA)
          </h2>
          <p class="text-xs text-neutral-400 mt-1">
            Nhập mã bảo mật 6 số được gửi về ứng dụng xác thực hoặc SMS của bạn
          </p>
        </div>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- 6-digit OTP Inputs Grid -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-liver-black text-center mb-3">
              Mã bảo mật gồm 6 chữ số
            </label>

            <div class="flex items-center justify-center gap-2 sm:gap-2.5" (paste)="onPaste($event)">
              @for (digit of otpDigits; track $index; let i = $index) {
                <input
                  #otpInput
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  [value]="otpDigits[i]"
                  (input)="onInput($event, i)"
                  (keydown)="onKeyDown($event, i)"
                  class="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black bg-neutral-50 border-2 rounded-xl text-liver-black transition-all focus:outline-none focus:bg-white focus:border-liver-red focus:ring-4 focus:ring-liver-red/20"
                  [class.border-liver-red]="otpDigits[i] !== ''"
                  [class.border-neutral-300]="otpDigits[i] === ''"
                />
              }
            </div>
            <p class="text-[11px] text-neutral-400 text-center mt-2">
              Mã gợi ý thử nghiệm: <span class="font-bold text-liver-red">123456</span>
            </p>
          </div>

          <!-- Verify Action Button -->
          <button
            type="button"
            (click)="onVerify()"
            [disabled]="!isOtpComplete || isSubmitting"
            class="w-full py-3 px-4 rounded-xl bg-liver-red hover:bg-liver-redHover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-liver-red/30 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isSubmitting) {
              <i class="fa-solid fa-circle-notch animate-spin"></i>
              <span>Đang kiểm tra mã xác thực...</span>
            } @else {
              <i class="fa-solid fa-shield-check"></i>
              <span>Xác Nhận & Đăng Nhập</span>
            }
          </button>

          <!-- Resend Code & Cancel Options -->
          <div class="pt-2 border-t border-neutral-100 flex flex-col items-center gap-2 text-xs">
            <button
              type="button"
              [disabled]="countdown > 0"
              (click)="resendCode()"
              class="font-semibold text-neutral-600 hover:text-liver-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ countdown > 0 ? ('Gửi lại mã xác thực sau (' + countdown + 's)') : 'Gửi lại mã OTP mới' }}
            </button>

            <a
              routerLink="/auth/login"
              class="text-neutral-400 hover:text-neutral-700 text-[11px] transition-colors"
            >
              Hủy bỏ và quay lại Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Verify2faComponent extends BaseComponent implements OnInit {
  private readonly authService = inject(AuthService);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpDigits: string[] = ['', '', '', '', '', ''];
  countdown = 60;
  private timer: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  get isOtpComplete(): boolean {
    return this.otpDigits.every(d => d !== '');
  }

  get otpCode(): string {
    return this.otpDigits.join('');
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, '');

    if (val) {
      this.otpDigits[index] = val.slice(-1);
      input.value = this.otpDigits[index];

      // Auto move focus to next input
      const inputs = this.otpInputs.toArray();
      if (index < inputs.length - 1) {
        inputs[index + 1].nativeElement.focus();
      }
    } else {
      this.otpDigits[index] = '';
    }

    if (this.isOtpComplete) {
      this.onVerify();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const inputs = this.otpInputs.toArray();

    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      inputs[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const cleanNumbers = pasteData.replace(/[^0-9]/g, '').slice(0, 6);

    if (cleanNumbers) {
      const inputs = this.otpInputs.toArray();
      for (let i = 0; i < cleanNumbers.length; i++) {
        this.otpDigits[i] = cleanNumbers[i];
        if (inputs[i]) {
          inputs[i].nativeElement.value = cleanNumbers[i];
        }
      }
      const nextIdx = Math.min(cleanNumbers.length, 5);
      if (inputs[nextIdx]) {
        inputs[nextIdx].nativeElement.focus();
      }
      if (this.isOtpComplete) {
        this.onVerify();
      }
    }
  }

  onVerify(): void {
    if (!this.isOtpComplete) return;

    this.isSubmitting = true;
    this.authService.verify2FA(this.otpCode).subscribe({
      next: valid => {
        this.isSubmitting = false;
        if (valid) {
          this.showSuccess('Xác thực bảo mật thành công!');
          this.router.navigate(['/dashboard']);
        } else {
          this.showError('Mã xác thực không hợp lệ hoặc đã hết hạn!');
          this.otpDigits = ['', '', '', '', '', ''];
          const inputs = this.otpInputs.toArray();
          inputs.forEach(inp => (inp.nativeElement.value = ''));
          if (inputs[0]) inputs[0].nativeElement.focus();
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.showError('Có lỗi xảy ra khi xác thực OTP!');
      }
    });
  }

  resendCode(): void {
    this.countdown = 60;
    this.startCountdown();
    this.showInfo('Đã gửi mã OTP mới!');
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
