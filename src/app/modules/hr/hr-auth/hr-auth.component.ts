import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthHttpService } from '../../../modules/gateway/services/auth-http.service';
import { UserStore } from '../../../core/store/user.store';
import { ToastService } from '../../../shared/services/ui/toast.service';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'app-hr-auth',
  templateUrl: './hr-auth.component.html',
})
export class HrAuthComponent {
  loginForm;
  registerForm;
  haveAccount$ = new BehaviorSubject<boolean>(true);
  isFormSubmiting$ = new BehaviorSubject<boolean>(false);

  constructor(
      private fb: FormBuilder,
      private authService: AuthHttpService,
      private userStore: UserStore,
      private toastService: ToastService,
      private router: Router,
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });
  }

  toggleCrateAccount() {
    this.haveAccount$.next(!this.haveAccount$.value);
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isFormSubmiting$.next(true);

    this.authService.loginHr(this.loginForm.getRawValue()).pipe(
      finalize(() => this.isFormSubmiting$.next(false))
    ).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.saveRole('hr');
        this.authService.saveEmail(res.email);
        this.userStore.setUser({ name: res.name, email: res.email, role: 'hr', token: res.token });

        this.router.navigate(['/hr/dashboard']);
        this.toastService.open(`Welcome ${res.name}`, 'success');
      },
      error: (err) => {
        this.toastService.open(err.error.message ?? 'Something went wrong', 'error');
      },
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isFormSubmiting$.next(true);

    this.authService.registerHr(this.registerForm.getRawValue()).pipe(
      finalize(() => this.isFormSubmiting$.next(false))
    ).subscribe({
      next: (res: any) => {
        this.toastService.open("Account successfully created!", 'success');
        this.haveAccount$.next(true); 
      },
      error: (err) => {
        this.toastService.open(err.error.message ?? 'Something went wrong', 'error');
      }
    });
  }
}