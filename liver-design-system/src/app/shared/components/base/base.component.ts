import { Directive, OnDestroy, inject, signal, DestroyRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { NotificationService, ToastService } from '../../../core/services/notification.service';
import { ModalService, ConfirmModalOptions } from '../../../core/services/modal.service';
import { DrawerService, DrawerOptions } from '../../../core/services/drawer.service';

/**
 * BaseComponent - Lớp cơ sở dùng chung cho toàn bộ các Component trong dự án LIVER.
 * Tự động inject sẵn các Service thường dùng (Toast, Modal, Router, FormBuilder...)
 * và quản lý vòng đời RxJS (destroy$), biến cờ trạng thái (loading, isSubmitting).
 */
@Directive()
export abstract class BaseComponent implements OnDestroy {
  // Services dùng chung
  protected readonly toast = inject(ToastService);
  protected readonly notificationService = this.toast;
  protected readonly modal = inject(ModalService);
  protected readonly drawer = inject(DrawerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);

  // Subject phục vụ hủy Subscription khi destroy component
  protected readonly destroy$ = new Subject<void>();

  // Các biến cờ trạng thái thông dụng (hỗ trợ cả boolean và Signal)
  public isSubmitting = false;
  public isLoading = false;
  public isEditing = false;
  public readonly loading = signal<boolean>(false);

  /**
   * Hiển thị thông báo thành công (Success Toast)
   */
  protected showSuccess(message: string, durationMs: number = 3200): void {
    this.toast.show(message, 'success', durationMs);
  }

  /**
   * Hiển thị thông báo lỗi (Error Toast)
   */
  protected showError(message: string, durationMs: number = 3500): void {
    this.toast.show(message, 'error', durationMs);
  }

  /**
   * Hiển thị cảnh báo (Warning Toast)
   */
  protected showWarning(message: string, durationMs: number = 3200): void {
    this.toast.show(message, 'warning', durationMs);
  }

  /**
   * Hiển thị thông tin (Info Toast)
   */
  protected showInfo(message: string, durationMs: number = 3000): void {
    this.toast.show(message, 'info', durationMs);
  }

  /**
   * Mở modal xác nhận (Confirm Dialog) trả về Promise<boolean>
   * @param messageOrOptions Chuỗi thông điệp hoặc đối tượng ConfirmModalOptions
   * @param title Tiêu đề hộp thoại nếu truyền message dạng chuỗi
   */
  protected confirm(
    messageOrOptions: string | ConfirmModalOptions,
    title: string = 'Xác nhận thao tác'
  ): Promise<boolean> {
    if (typeof messageOrOptions === 'string') {
      return this.modal.confirm({
        title,
        message: messageOrOptions,
        variant: 'danger',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy bỏ'
      });
    }
    return this.modal.confirm(messageOrOptions);
  }

  /**
   * Mở Drawer bảng trượt cạnh bên
   */
  protected openDrawer<T = any>(options: DrawerOptions<T>): void {
    this.drawer.open(options);
  }

  /**
   * Đóng Drawer
   */
  protected closeDrawer(result?: any): void {
    this.drawer.close(result);
  }

  /**
   * Hàm trackBy cho *ngFor / @for tối ưu hiệu năng
   */
  public trackById(index: number, item: any): any {
    return item?.id ?? item?.code ?? item?.mnv ?? index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
