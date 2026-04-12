import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrAuthComponent } from './hr-auth.component';
import { of, throwError } from 'rxjs';
import { AuthHttpService } from '../../../modules/gateway/services/auth-http.service';
import { vi } from 'vitest';

// Mock service
class MockAuthHttpService {
  loginHr = vi.fn().mockReturnValue(of({ token: 'abc', email: 'test@test.com', name: 'Test' }));
  registerHr = vi.fn().mockReturnValue(of({ token: 'xyz', email: 'new@test.com', name: 'NewUser' }));
  saveToken = vi.fn();
  saveRole = vi.fn();
  saveEmail = vi.fn();
}

describe('HrAuthComponent', () => {
  let component: HrAuthComponent;
  let fixture: ComponentFixture<HrAuthComponent>;
  let authService: MockAuthHttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      providers: [
        { provide: AuthHttpService, useClass: MockAuthHttpService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HrAuthComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthHttpService) as unknown as MockAuthHttpService;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('login form should be valid with proper values', () => {
    component.loginForm.setValue({ email: 'test@email.com', password: 'testpass123' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should toggle haveAccount state properly', () => {
    expect(component.haveAccount()).toBe(true);
    component.toggleCrateAccount();
    expect(component.haveAccount()).toBe(false);
  });

  it('should call loginHr on submit when form is valid', () => {
    component.loginForm.setValue({ email: 'test@gmail.com', password: 'test123' });
    component.onLoginSubmit();

    expect(authService.loginHr).toHaveBeenCalledWith({ email: 'test@gmail.com', password: 'test123' });
  });

  it('should handle login error correctly', () => {
    authService.loginHr.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );

    component.loginForm.setValue({ email: 'wrong@test.com', password: 'badpass' });
    component.onLoginSubmit();

    expect(component.isFormSubmiting()).toBe(false);
  });

  it('should call registerHr on submit when form is valid', () => {
    component.registerForm.setValue({ email: 'new@test.com', name: 'NewUser', password: 'newpass123' });
    component.onRegisterSubmit();

    expect(authService.registerHr).toHaveBeenCalledWith({ email: 'new@test.com', name: 'NewUser', password: 'newpass123' });
    expect(component.haveAccount()).toBe(true);
  });

  it('should handle register error correctly', () => {
    authService.registerHr.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Email already exists' } }))
    );

    component.registerForm.setValue({ email: 'dup@test.com', name: 'Dup', password: 'dup123' });
    component.onRegisterSubmit();

    expect(component.isFormSubmiting()).toBe(false);
  });
});
