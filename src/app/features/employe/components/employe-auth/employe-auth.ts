import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth/auth';
import { UserStore } from '../../../../core/store/user.store';

@Component({
  selector: 'app-employe-auth',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput],
  templateUrl: './employe-auth.html',
  styleUrl: './employe-auth.css',
})
export class EmployeAuth {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userStore: UserStore,
    private router: Router,
    private _snackbar: MatSnackBar
  ){
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  handleLogin(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.loginEmploye(this.loginForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.saveRole('employe');

        console.log("user data", res);
        // Workaround destrucuring employee data
        delete res.employe.role;
        this.userStore.setUser({ ...res.employe, roleGlobal: 'employe', token: res.token });
        this.router.navigate(['/employe/dashboard']);
        this._snackbar.open(`Welcome ${res.employe.name}`);
      }
    })
  }
}
