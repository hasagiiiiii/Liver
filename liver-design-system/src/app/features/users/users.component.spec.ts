import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';

describe('UsersComponent', () => {
  let fixture: ComponentFixture<UsersComponent>;
  let component: UsersComponent;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [provideRouter([]), UserService, NotificationService]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create UsersComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', async () => {
    component.ngOnInit();
    await new Promise(r => setTimeout(r, 300));
    expect(component.usersList.length).toBeGreaterThan(0);
    expect(component.totalUsersCount).toBeGreaterThan(0);
  });

  it('should open and close Add Modal', () => {
    expect(component.isFormModalOpen).toBe(false);
    component.openAddModal();
    expect(component.isFormModalOpen).toBe(true);
    expect(component.modalMode).toBe('ADD');
    expect(component.userForm.get('mnv')?.value).toBeTruthy();

    component.closeFormModal();
    expect(component.isFormModalOpen).toBe(false);
  });

  it('should open Edit Modal with user data populated', () => {
    const mockUser = userService.users()[0];
    component.openEditModal(mockUser);
    expect(component.isFormModalOpen).toBe(true);
    expect(component.modalMode).toBe('EDIT');
    expect(component.userForm.get('mnv')?.value).toBe(mockUser.mnv);
    expect(component.userForm.get('username')?.value).toBe(mockUser.username);
  });

  it('should open Single Delete Modal', () => {
    const mockUser = userService.users()[0];
    component.openSingleDeleteModal(mockUser);
    expect(component.isDeleteModalOpen).toBe(true);
    expect(component.deleteTargetMode).toBe('SINGLE');
    expect(component.userToDelete).toBe(mockUser);
  });

  it('should open Batch Delete Modal when rows are selected', () => {
    component.selectedUsers = [userService.users()[0], userService.users()[1]];
    component.openBatchDeleteModal();
    expect(component.isDeleteModalOpen).toBe(true);
    expect(component.deleteTargetMode).toBe('BATCH');
  });

  it('should filter users by role and reset filters', async () => {
    component.filterRole = 'ADMIN';
    component.applyFilter();
    await new Promise(r => setTimeout(r, 300));
    expect(component.usersList.every(u => u.role === 'ADMIN')).toBe(true);

    component.resetFilters();
    await new Promise(r => setTimeout(r, 300));
    expect(component.filterRole).toBe('ALL');
    expect(component.usersList.length).toBe(userService.users().length);
  });
});

