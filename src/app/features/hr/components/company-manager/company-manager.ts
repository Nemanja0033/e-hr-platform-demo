import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { CompanyInterface, CompanyStore } from '../../store/company.store';
import { CompanyService } from '../../services/http/company-http.service';


@Component({
  selector: 'app-company-manager',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './company-manager.html',
  styleUrl: './company-manager.css',
})
export class Company {
  company;
  loading;
  
  isRegisterMode = signal<boolean>(false);
  registerCompanyForm;

  constructor(
    private companyStore: CompanyStore,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar
  ) {
    this.company = companyStore.company;
    this.loading = companyStore.loading;
    
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
        this.companyStore.refetch()
        this.isRegisterMode.set(false);
      },
      error: (err) => {
        console.error(err)
        this._snackbar.open(err.error.message, "Got it");
      }
    })
  }
}
