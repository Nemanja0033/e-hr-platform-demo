import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth';
import { UserStore } from '../../../core/store/user.store';
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-employe-auth',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput, MatButton],
  templateUrl: './employe-auth.html',
  styleUrl: './employe-auth.css',
})
export class EmployeAuth {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userStore: UserStore
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  handleLogin(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log(this.loginForm.value);
  }
}
