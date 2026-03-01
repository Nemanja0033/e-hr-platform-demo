import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStore } from '../../../core/store/user.store';
import { AuthHttpService } from '../../../core/services/http/auth-http.service';
import { RouterLink } from '@angular/router'; // Assuming RouterLink is needed for EmployeeDashboardComponent
import { WebSocketService } from '../../../core/services/ws/webSocket.service';

@Component({
  selector: 'app-employee-auth',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput],
  templateUrl: './employee-auth.component.html',
  styleUrl: './employee-auth.component.css',
})
export class EmployeeAuthComponent {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthHttpService,
    private userStore: UserStore,
    private router: Router,
    private _snackbar: MatSnackBar,
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

    this.authService.loginEmployee(this.loginForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.authService.saveRole('employe');
        this.authService.saveEmail(res.email);

        console.log("user data", res);
        // Workaround destrucuring employee data
        delete res.employe.role;
        this.userStore.setUser({ ...res.employe, roleGlobal: 'employe', token: res.token });
        
        this.router.navigate(['/employee/dashboard']);
        this._snackbar.open(`Welcome ${res.employe.name}`);
      }
    })
  }
}
