import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { CompanyInterface, CompanyService } from '../../../core/services/company.service';


@Component({
  selector: 'app-company-manager',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './company-manager.component.html',
  styleUrl: './company-manager.component.css',
})
export class CompanyManagerComponent {
  company;
  loading;
  
  isRegisterMode = signal<boolean>(false);
  registerCompanyForm;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar
  ) {
    this.company = companyService.company;
    this.loading = companyService.loading;
    
    this.registerCompanyForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
    });
  }

  toggleRegisterMode() {
    this.isRegisterMode.set(true);
  }

  onSubmitCompanyRegister() {
    if (this.registerCompanyForm.invalid) {
      this.registerCompanyForm.markAllAsTouched();
      return;
    }

    this.companyService.registerCompany(this.registerCompanyForm.getRawValue()).subscribe({
      next: (res: any) => {
        this._snackbar.open("Company registered", "Close");
        this.companyService.refetch()
        this.isRegisterMode.set(false);
      },
      error: (err) => {
        console.error(err)
        this._snackbar.open(err.error.message, "Got it");
      }
    })
  }
}
