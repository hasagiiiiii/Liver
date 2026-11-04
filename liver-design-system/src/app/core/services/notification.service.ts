import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', durationMs: number = 3200): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      message,
      type,
      timestamp: Date.now()
    };

    this.toastsSignal.update(toasts => [...toasts, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  remove(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}

export { NotificationService as ToastService };

