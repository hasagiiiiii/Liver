import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../core/services/auth.service';

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideRouter([]), AuthService]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create profile component', () => {
    expect(component).toBeTruthy();
  });

  it('should render profile header with current user info', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Đỗ Văn Trung');
    expect(el.textContent).toContain('ADMIN');
  });

  it('should calculate password strength correctly', () => {
    component.passwordForm.patchValue({ newPassword: '123' });
    expect(component.passwordStrengthText).toBe('Yếu');

    component.passwordForm.patchValue({ newPassword: 'password123' });
    expect(component.passwordStrengthText).toBe('Mạnh');
  });

  it('should toggle 2FA state', () => {
    const initial2FA = component.is2FAEnabled;
    component.toggle2FA();
    expect(component.is2FAEnabled).toBe(!initial2FA);
  });
});
