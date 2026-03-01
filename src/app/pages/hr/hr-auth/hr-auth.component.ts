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
  styleUrl: './hr-auth.component.css',
})
export class HrAuthComponent {
  loginForm;
  registerForm;
  haveAccount = signal(true);
  // View child angular way to have an reference to the HTML elements.
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

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
      // surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(38)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });
  }

  toggleCrateAccount() {
    this.haveAccount.update(prev => !prev);
  }

  // Login logic flow
  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.loginHr(this.loginForm.getRawValue()).subscribe({
      next: (res: any) => {
        // Save token and the role in localStorage (workaround)
        this.authService.saveToken(res.token);
        this.authService.saveRole('hr');
        this.authService.saveEmail(res.email);
        
        // Set user data into store rxjs
        this.userStore.setUser({ name: res.name, email: res.email, role: 'hr', token: res.token });

        // Navigate further & show snackbar
        this.router.navigate(['/hr/dashboard']);
        this._snackBar.open(`Welcome ${res.name}`)
      },
      error: (err) => {
        this._snackBar.open(err.error.message, 'Close')
      }
    });
  }

  // Register logic
  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.registerHr(this.registerForm.getRawValue()).subscribe({
      next: (res: any) => {
        this._snackBar.open("Account succesfully created!")
        this.haveAccount.set(true); // Push user to login after succesfully register.
      },
      error: (err) => {
        this._snackBar.open(err.error.message, 'Got it');
      }
    });
  }
}