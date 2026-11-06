import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, tap } from 'rxjs';
import { NotificationService } from './notification.service';

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  role: 'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'DEVOPS' | 'DESIGNER' | 'TESTER';
  permissions: string[];
  avatar: string;
  avatarBg?: string;
  twoFactorEnabled?: boolean;
}

const DEFAULT_ADMIN_USER: AuthUser = {
  id: 'usr-001',
  username: 'trungdv',
  fullName: 'Đỗ Văn Trung',
  email: 'dvant24102003@gmail.com',
  phone: '0988123456',
  department: 'Khối Công Nghệ & Giải Pháp Phần Mềm',
  role: 'ADMIN',
  permissions: [
    'ADMIN',
    'USER_VIEW',
    'USER_CREATE',
    'USER_EDIT',
    'USER_DELETE',
    'ANALYTICS_VIEW',
    'SETTINGS_MANAGE'
  ],
  avatar: 'DT',
  avatarBg: 'var(--liver-red)',
  twoFactorEnabled: false
};

const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  ADMIN: [
    'ADMIN',
    'USER_VIEW',
    'USER_CREATE',
    'USER_EDIT',
    'USER_DELETE',
    'ANALYTICS_VIEW',
    'SETTINGS_MANAGE'
  ],
  MANAGER: ['USER_VIEW', 'USER_CREATE', 'USER_EDIT', 'ANALYTICS_VIEW'],
  DEVELOPER: ['USER_VIEW', 'ANALYTICS_VIEW']
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  private readonly _currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly currentUser = this._currentUser.asReadonly();

  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly currentRole = computed(() => this._currentUser()?.role || '');
  readonly permissions = computed(() => this._currentUser()?.permissions || []);

  private getStoredUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_ADMIN_USER;
    }
    const saved = localStorage.getItem('liver_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ADMIN_USER;
      }
    }
    return DEFAULT_ADMIN_USER;
  }

  hasPermission(requiredPermissions: string | string[], mode: 'any' | 'all' = 'any'): boolean {
    const user = this._currentUser();
    if (!user) return false;

    // Super Admin has all privileges
    if (user.role === 'ADMIN' || user.permissions.includes('ADMIN')) {
      return true;
    }

    const needed = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    if (needed.length === 0) return true;

    if (mode === 'all') {
      return needed.every(p => user.permissions.includes(p));
    }
    return needed.some(p => user.permissions.includes(p));
  }

  hasRole(requiredRoles: string | string[]): boolean {
    const user = this._currentUser();
    if (!user) return false;

    if (user.role === 'ADMIN') return true;

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  }

  login(credentials: { username: string; password?: string; rememberMe?: boolean }): Observable<AuthUser> {
    const username = credentials.username.toLowerCase().trim();
    let role: AuthUser['role'] = 'ADMIN';

    if (username.includes('manager')) {
      role = 'MANAGER';
    } else if (username.includes('dev')) {
      role = 'DEVELOPER';
    }

    const authUser: AuthUser = {
      ...DEFAULT_ADMIN_USER,
      username: username || 'trungdv',
      role,
      permissions: ROLE_PERMISSIONS_MAP[role] || ROLE_PERMISSIONS_MAP['ADMIN']
    };

    return of(authUser).pipe(
      delay(300),
      tap(user => {
        this._currentUser.set(user);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('liver_auth_user', JSON.stringify(user));
          localStorage.setItem('liver_auth_token', 'mock_jwt_token_' + Date.now());
        }
      })
    );
  }

  logout(): void {
    this._currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('liver_auth_user');
      localStorage.removeItem('liver_auth_token');
    }
    this.toast.show('Đã đăng xuất khỏi phiên làm việc', 'info');
    this.router.navigate(['/auth/login']);
  }

  verify2FA(code: string): Observable<boolean> {
    // Accepts any 6-digit code or '123456'
    const valid = code.trim().length === 6;
    return of(valid).pipe(delay(350));
  }

  sendForgotPassword(email: string): Observable<boolean> {
    return of(true).pipe(delay(350));
  }

  updateProfile(data: Partial<AuthUser>): Observable<AuthUser> {
    const current = this._currentUser() || DEFAULT_ADMIN_USER;
    const updated: AuthUser = {
      ...current,
      ...data
    };
    this._currentUser.set(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('liver_auth_user', JSON.stringify(updated));
    }
    return of(updated).pipe(delay(250));
  }

  changePassword(oldPass: string, newPass: string): Observable<boolean> {
    return of(true).pipe(delay(350));
  }

  /**
   * Helper switch vai trò tức thì để test Directive và Guards ngay trên giao diện
   */
  switchRole(role: 'ADMIN' | 'MANAGER' | 'DEVELOPER'): void {
    const current = this._currentUser() || DEFAULT_ADMIN_USER;
    const updated: AuthUser = {
      ...current,
      role,
      permissions: ROLE_PERMISSIONS_MAP[role]
    };
    this._currentUser.set(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('liver_auth_user', JSON.stringify(updated));
    }
    this.toast.show(`Đã chuyển sang vai trò: ${role}`, 'info');
  }
}
