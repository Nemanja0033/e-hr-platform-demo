import { Component, signal } from '@angular/core';
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  loginForm;
  registerForm;
  haveAccount = signal(true);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(38)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });

  }

  toggleCrateAccount() {
    this.haveAccount.update((perv) => perv === false ? true : false);
  }

  onLoginSubmit() {
    console.log("Login submited", this.loginForm.value)
  }

  onRegisterSubmit() {
    console.log("Register submit", this.registerForm.value)
  }
}
