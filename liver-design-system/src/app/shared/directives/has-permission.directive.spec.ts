import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HasPermissionDirective } from './has-permission.directive';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [HasPermissionDirective],
  template: `
    <div id="admin-section" *appHasPermission="['ADMIN']">Admin Only Content</div>
    <div id="delete-section" *appHasPermission="['USER_DELETE']">Delete Button</div>
    <button id="disable-btn" [appHasPermission]="['USER_DELETE']" [appHasPermissionDisabled]="true">
      Xóa phần tử
    </button>
  `
})
class TestHostComponent {}

describe('HasPermissionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, HasPermissionDirective],
      providers: [AuthService]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(TestHostComponent);
  });

  it('should render content when user has ADMIN permission', () => {
    authService.switchRole('ADMIN');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#admin-section')).toBeTruthy();
    expect(el.querySelector('#delete-section')).toBeTruthy();
  });

  it('should hide delete-section when user role is DEVELOPER', () => {
    authService.switchRole('DEVELOPER');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#delete-section')).toBeFalsy();
  });

  it('should disable button instead of hiding when disabledMode is true', () => {
    authService.switchRole('DEVELOPER');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('#disable-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(btn.classList.contains('cursor-not-allowed')).toBe(true);
  });
});
