import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export type UserRole = 'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'DESIGNER' | 'TESTER' | 'DEVOPS';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';

export interface User {
  id: string;
  stt?: number;
  mnv: string;          // Mã nhân viên
  username: string;     // Tên đăng nhập
  fullName: string;     // Họ và tên
  email: string;        // Email
  avatar: string;       // URL hoặc Chữ cái đại diện
  avatarBg?: string;    // Màu nền avatar đại diện
  role: UserRole;       // Quyền / Vai trò
  phone: string;        // Số điện thoại
  status: UserStatus;   // Trạng thái hoạt động
  createdAt: string;    // Ngày tạo
  updatedAt: string;    // Ngày cập nhật
}

export interface UserFilter {
  keyword?: string;
  role?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly initialUsers: User[] = [
    {
      id: 'usr-001',
      mnv: 'LIV-001',
      username: 'trungdv',
      fullName: 'Đỗ Văn Trung',
      email: 'dvant24102003@gmail.com',
      avatar: 'DT',
      avatarBg: 'var(--liver-red)',
      role: 'ADMIN',
      phone: '0988123456',
      status: 'ACTIVE',
      createdAt: '2026-01-15 08:30:00',
      updatedAt: '2026-11-02 14:20:00'
    },
    {
      id: 'usr-002',
      mnv: 'LIV-002',
      username: 'namnv',
      fullName: 'Nguyễn Văn Nam',
      email: 'nam.nguyen@liver.io',
      avatar: 'NN',
      avatarBg: '#2563eb',
      role: 'MANAGER',
      phone: '0977234567',
      status: 'ACTIVE',
      createdAt: '2026-02-10 09:15:00',
      updatedAt: '2026-10-28 11:00:00'
    },
    {
      id: 'usr-003',
      mnv: 'LIV-003',
      username: 'phuongtt',
      fullName: 'Trần Thị Phương',
      email: 'phuong.tran@liver.io',
      avatar: 'TP',
      avatarBg: '#16a34a',
      role: 'DEVELOPER',
      phone: '0966345678',
      status: 'ACTIVE',
      createdAt: '2026-03-01 10:00:00',
      updatedAt: '2026-11-01 16:45:00'
    },
    {
      id: 'usr-004',
      mnv: 'LIV-004',
      username: 'hoanglm',
      fullName: 'Lê Minh Hoàng',
      email: 'hoang.le@liver.io',
      avatar: 'LH',
      avatarBg: '#9333ea',
      role: 'DEVOPS',
      phone: '0912456789',
      status: 'ACTIVE',
      createdAt: '2026-03-15 14:00:00',
      updatedAt: '2026-10-30 08:15:00'
    },
    {
      id: 'usr-005',
      mnv: 'LIV-005',
      username: 'anhtt',
      fullName: 'Tạ Thùy Anh',
      email: 'anh.ta@liver.io',
      avatar: 'TA',
      avatarBg: '#ea580c',
      role: 'DESIGNER',
      phone: '0903567890',
      status: 'ACTIVE',
      createdAt: '2026-04-05 11:20:00',
      updatedAt: '2026-10-25 17:30:00'
    },
    {
      id: 'usr-006',
      mnv: 'LIV-006',
      username: 'dungpv',
      fullName: 'Phạm Văn Dũng',
      email: 'dung.pham@liver.io',
      avatar: 'PD',
      avatarBg: '#0891b2',
      role: 'TESTER',
      phone: '0934678901',
      status: 'ACTIVE',
      createdAt: '2026-05-12 13:40:00',
      updatedAt: '2026-10-20 15:10:00'
    },
    {
      id: 'usr-007',
      mnv: 'LIV-007',
      username: 'haont',
      fullName: 'Nguyễn Thị Hảo',
      email: 'hao.nguyen@liver.io',
      avatar: 'NH',
      avatarBg: '#475569',
      role: 'DEVELOPER',
      phone: '0945789012',
      status: 'INACTIVE',
      createdAt: '2026-06-20 08:45:00',
      updatedAt: '2026-09-15 10:20:00'
    },
    {
      id: 'usr-008',
      mnv: 'LIV-008',
      username: 'quangvm',
      fullName: 'Vũ Minh Quang',
      email: 'quang.vu@liver.io',
      avatar: 'VQ',
      avatarBg: '#e11d48',
      role: 'DEVELOPER',
      phone: '0989890123',
      status: 'LOCKED',
      createdAt: '2026-07-08 15:30:00',
      updatedAt: '2026-10-18 09:00:00'
    },
    {
      id: 'usr-009',
      mnv: 'LIV-009',
      username: 'maith',
      fullName: 'Trương Hoàng Mai',
      email: 'mai.truong@liver.io',
      avatar: 'TM',
      avatarBg: '#059669',
      role: 'MANAGER',
      phone: '0918901234',
      status: 'ACTIVE',
      createdAt: '2026-08-01 09:00:00',
      updatedAt: '2026-11-03 10:45:00'
    },
    {
      id: 'usr-010',
      mnv: 'LIV-010',
      username: 'tuanba',
      fullName: 'Bùi Anh Tuấn',
      email: 'tuan.bui@liver.io',
      avatar: 'BT',
      avatarBg: '#d97706',
      role: 'DEVOPS',
      phone: '0923012345',
      status: 'ACTIVE',
      createdAt: '2026-08-25 16:15:00',
      updatedAt: '2026-10-29 13:20:00'
    },
    {
      id: 'usr-011',
      mnv: 'LIV-011',
      username: 'linhdt',
      fullName: 'Đoàn Thùy Linh',
      email: 'linh.doan@liver.io',
      avatar: 'DL',
      avatarBg: '#db2777',
      role: 'DESIGNER',
      phone: '0938123789',
      status: 'ACTIVE',
      createdAt: '2026-09-10 10:30:00',
      updatedAt: '2026-11-02 18:00:00'
    },
    {
      id: 'usr-012',
      mnv: 'LIV-012',
      username: 'thanhnc',
      fullName: 'Ngô Công Thành',
      email: 'thanh.ngo@liver.io',
      avatar: 'NT',
      avatarBg: '#4f46e5',
      role: 'TESTER',
      phone: '0979234890',
      status: 'INACTIVE',
      createdAt: '2026-09-28 14:10:00',
      updatedAt: '2026-10-12 16:30:00'
    }
  ];

  // Reactive State using Angular Signals
  readonly users = signal<User[]>([...this.initialUsers]);
  readonly loading = signal<boolean>(false);

  /**
   * Giả lập gọi API lấy danh sách người dùng với độ trễ (delay)
   */
  getUsers(filter?: UserFilter): Observable<User[]> {
    this.loading.set(true);
    let result = [...this.users()];

    if (filter) {
      if (filter.keyword) {
        const q = filter.keyword.toLowerCase().trim();
        result = result.filter(u =>
          u.mnv.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      }
      if (filter.role && filter.role !== 'ALL') {
        result = result.filter(u => u.role === filter.role);
      }
      if (filter.status && filter.status !== 'ALL') {
        result = result.filter(u => u.status === filter.status);
      }
    }

    return of(result).pipe(
      delay(250),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Giả lập API lấy chi tiết một người dùng
   */
  getUserById(id: string): Observable<User | undefined> {
    const user = this.users().find(u => u.id === id);
    return of(user).pipe(delay(150));
  }

  /**
   * Giả lập API tạo người dùng mới
   */
  createUser(dto: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'stt'>): Observable<User> {
    this.loading.set(true);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newUser: User = {
      ...dto,
      id: 'usr-' + String(Date.now()).slice(-4),
      createdAt: now,
      updatedAt: now
    };

    const nextUsers = [newUser, ...this.users()];
    this.users.set(nextUsers);

    return of(newUser).pipe(
      delay(300),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Giả lập API cập nhật người dùng
   */
  updateUser(id: string, dto: Partial<User>): Observable<User> {
    this.loading.set(true);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let updatedUser: User | undefined;

    const nextUsers = this.users().map(u => {
      if (u.id === id) {
        updatedUser = {
          ...u,
          ...dto,
          updatedAt: now
        };
        return updatedUser;
      }
      return u;
    });

    this.users.set(nextUsers);

    return of(updatedUser || (dto as User)).pipe(
      delay(300),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Giả lập API xóa một người dùng
   */
  deleteUser(id: string): Observable<boolean> {
    this.loading.set(true);
    const nextUsers = this.users().filter(u => u.id !== id);
    this.users.set(nextUsers);

    return of(true).pipe(
      delay(250),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Giả lập API xóa nhiều người dùng cùng lúc (Batch Delete)
   */
  deleteMultipleUsers(ids: string[]): Observable<boolean> {
    this.loading.set(true);
    const idSet = new Set(ids);
    const nextUsers = this.users().filter(u => !idSet.has(u.id));
    this.users.set(nextUsers);

    return of(true).pipe(
      delay(350),
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Sinh mã nhân viên tiếp theo tự động
   */
  getNextMNV(): string {
    const numbers = this.users()
      .map(u => {
        const match = u.mnv.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `LIV-${String(maxNum + 1).padStart(3, '0')}`;
  }
}

