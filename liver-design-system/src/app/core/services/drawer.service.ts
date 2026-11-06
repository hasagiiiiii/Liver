import { Injectable, signal, TemplateRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type DrawerPlacement = 'right' | 'left' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;

export interface DrawerOptions<TData = any> {
  title?: string;
  subtitle?: string;
  icon?: string;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  hasBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  template?: TemplateRef<any>;
  data?: TData;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export interface DrawerState<TData = any> {
  isOpen: boolean;
  options: DrawerOptions<TData> | null;
}

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private readonly _state = signal<DrawerState>({
    isOpen: false,
    options: null
  });

  private readonly _afterClosed$ = new Subject<any>();

  readonly state = this._state.asReadonly();
  readonly afterClosed$: Observable<any> = this._afterClosed$.asObservable();

  open<TData = any>(options: DrawerOptions<TData>): void {
    this._state.set({
      isOpen: true,
      options: {
        placement: 'right',
        size: 'md',
        hasBackdrop: true,
        closeOnBackdropClick: true,
        closeOnEsc: true,
        showFooter: false,
        confirmText: 'Lưu thay đổi',
        cancelText: 'Đóng',
        ...options
      }
    });
  }

  close(result?: any): void {
    this._state.set({
      isOpen: false,
      options: null
    });
    this._afterClosed$.next(result);
  }
}
