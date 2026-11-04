import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created and have initial dummy users', () => {
    expect(service).toBeTruthy();
    expect(service.users().length).toBeGreaterThan(0);
  });

  it('should get all users via getUsers', async () => {
    const users = await firstValueFrom(service.getUsers());
    expect(users.length).toBe(service.users().length);
  });

  it('should filter users by keyword', async () => {
    const users = await firstValueFrom(service.getUsers({ keyword: 'trungdv' }));
    expect(users.length).toBe(1);
    expect(users[0].username).toBe('trungdv');
  });

  it('should filter users by role', async () => {
    const users = await firstValueFrom(service.getUsers({ role: 'ADMIN' }));
    expect(users.every(u => u.role === 'ADMIN')).toBe(true);
  });

  it('should create new user', async () => {
    const initialCount = service.users().length;
    const newUser = await firstValueFrom(
      service.createUser({
        mnv: 'LIV-999',
        username: 'testuser',
        fullName: 'Nguyễn Văn Test',
        email: 'test@liver.io',
        phone: '0987654321',
        role: 'DEVELOPER',
        status: 'ACTIVE',
        avatar: 'NT'
      })
    );
    expect(newUser.id).toBeTruthy();
    expect(service.users().length).toBe(initialCount + 1);
    expect(service.users()[0].username).toBe('testuser');
  });

  it('should update an existing user', async () => {
    const targetUser = service.users()[0];
    const updated = await firstValueFrom(
      service.updateUser(targetUser.id, { fullName: 'Đỗ Văn Trung Updated' })
    );
    expect(updated.fullName).toBe('Đỗ Văn Trung Updated');
    const inSignal = service.users().find(u => u.id === targetUser.id);
    expect(inSignal?.fullName).toBe('Đỗ Văn Trung Updated');
  });

  it('should delete a user', async () => {
    const targetUser = service.users()[0];
    const initialCount = service.users().length;
    const result = await firstValueFrom(service.deleteUser(targetUser.id));
    expect(result).toBe(true);
    expect(service.users().length).toBe(initialCount - 1);
    expect(service.users().some(u => u.id === targetUser.id)).toBe(false);
  });

  it('should delete multiple users (batch delete)', async () => {
    const user1 = service.users()[0];
    const user2 = service.users()[1];
    const initialCount = service.users().length;

    const result = await firstValueFrom(service.deleteMultipleUsers([user1.id, user2.id]));
    expect(result).toBe(true);
    expect(service.users().length).toBe(initialCount - 2);
    expect(service.users().some(u => u.id === user1.id || u.id === user2.id)).toBe(false);
  });

  it('should generate next MNV automatically', () => {
    const nextMNV = service.getNextMNV();
    expect(nextMNV.startsWith('LIV-')).toBe(true);
  });
});
