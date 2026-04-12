import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../../core/store/user.store';
import { AuthHttpService } from '../../../modules/gateway/services/auth-http.service';
import { ToastService } from '../../../shared/services/ui/toast.service';

@Component({
  selector: 'app-employee-auth',
  templateUrl: './employee-auth.component.html',
})
export class EmployeeAuthComponent {
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthHttpService,
    private userStore: UserStore,
    private router: Router,
    private toastService: ToastService,
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
        this.authService.saveEmail(res.employe.email);

        // Workaround destructuring employee data
        delete res.employe.role;
        this.userStore.setUser({ ...res.employe, roleGlobal: 'employe', token: res.token });
        
        this.router.navigate(['/employee/dashboard']);
        this.toastService.open(`Welcome ${res.employe.name}`, 'success');
      },
      error: (err) => {
        this.toastService.open(err.error?.message ?? 'Something went wrong', 'error');
      }
    })
  }
}
