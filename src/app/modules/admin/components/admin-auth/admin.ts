import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
  loginForm;
  registerForm;
  haveAccount = signal(true);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(38)]],
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

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res: any) => {
        console.log('Login success', res);
        this.authService.saveToken(res.token);
      },
      error: (err) => console.error('Login failed', err)
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: (res: any) => {
        console.log('Register success', res);
        this.authService.saveToken(res.token);
      },
      error: (err) => console.error('Register failed', err)
    });
  }
}