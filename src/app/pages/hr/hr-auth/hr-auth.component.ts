import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthHttpService } from '../../../core/services/http/auth-http.service';
import { UserStore } from '../../../core/store/user.store';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-hr-auth',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './hr-auth.component.html',
})
export class HrAuthComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  loginForm;
  registerForm;
  haveAccount = signal(true);
  isFormSubmiting = signal(false);

  ngAfterViewInit(){
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 200);
  }

  constructor(
      private fb: FormBuilder,
      private authService: AuthHttpService,
      private userStore: UserStore,
      private _snackBar: MatSnackBar,
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
    this.haveAccount.update(prev => !prev);
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isFormSubmiting.set(true);

    this.authService.loginHr(this.loginForm.getRawValue()).pipe(
      finalize(() => this.isFormSubmiting.set(false))
    ).subscribe({
      // Workaroung any casting just for demo purposes, proper types structure needed.
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.saveRole('hr');
        this.authService.saveEmail(res.email);
        this.userStore.setUser({ name: res.name, email: res.email, role: 'hr', token: res.token });

        this.router.navigate(['/hr/dashboard']);
        this._snackBar.open(`Welcome ${res.name}`, 'close')
      },
      error: (err) => {
        this._snackBar.open(err.error.message ?? 'Something went wrong', 'Close');
      },
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isFormSubmiting.set(true);

    this.authService.registerHr(this.registerForm.getRawValue()).pipe(
      finalize(() => this.isFormSubmiting.set(false))
    ).subscribe({
      next: (res: any) => {
        this._snackBar.open("Account succesfully created!", 'close')
        this.haveAccount.set(true); 
      },
      error: (err) => {
        this._snackBar.open(err.error.message ?? 'Something went wrong', 'Got it');
      }
    });
  }
}