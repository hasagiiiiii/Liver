import { Injectable, signal } from '@angular/core';

export type ModalVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmModalOptions {
  title: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  icon?: string;
}

export interface ModalState {
  isOpen: boolean;
  options: ConfirmModalOptions | null;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly stateSignal = signal<ModalState>({
    isOpen: false,
    options: null
  });

  readonly state = this.stateSignal.asReadonly();

  /**
   * Mở popup confirm trả về Promise<boolean>
   * @param options Cấu hình modal tiêu đề, nội dung, màu sắc
   */
  confirm(options: ConfirmModalOptions): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.stateSignal.set({
        isOpen: true,
        options: {
          confirmText: options.confirmText || 'Xác nhận',
          cancelText: options.cancelText || 'Hủy bỏ',
          variant: options.variant || 'danger',
          ...options
        },
        resolve
      });
    });
  }

  handleConfirm(): void {
    const current = this.stateSignal();
    if (current.resolve) {
      current.resolve(true);
    }
    this.close();
  }

  handleCancel(): void {
    const current = this.stateSignal();
    if (current.resolve) {
      current.resolve(false);
    }
    this.close();
  }

  close(): void {
    this.stateSignal.set({
      isOpen: false,
      options: null,
      resolve: undefined
    });
  }
}

