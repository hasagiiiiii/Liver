import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), AuthService]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should render login header and input controls', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('LIVER');
    expect(el.textContent).toContain('Đăng nhập');
  });

  it('should fill demo credentials when quick button clicked', () => {
    component.fillDemo('namnv_manager', 'mgr123');
    expect(component.loginForm.get('username')?.value).toBe('namnv_manager');
    expect(component.loginForm.get('password')?.value).toBe('mgr123');
  });
});
