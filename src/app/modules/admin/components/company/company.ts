import { Component, signal } from '@angular/core';
import { CompanyInterface, CompanyStore } from '../../../core/store/company.store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../core/services/company/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-company',
  imports: [AsyncPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
export class Company {
  company$: Observable<CompanyInterface | null>;
  loading$: Observable<boolean | null>;

  registerCompanyForm;
  isRegisterMode = signal<boolean>(false);

  constructor(
    private companyStore: CompanyStore,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar
  ) {
    this.company$ = this.companyStore.company$;
    this.loading$ = companyStore.loading$;

    this.registerCompanyForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
    });
  }

  toggleRegisterMode() {
    this.isRegisterMode.set(true);
  }

  onSubmitCompanyRegister() {
    console.log("SUBMIT")
    if (this.registerCompanyForm.invalid) {
      this.registerCompanyForm.markAllAsTouched();
      return;
    }

    this.companyService.registerCompany(this.registerCompanyForm.getRawValue()).subscribe({
      next: (res: any) => {
        this._snackbar.open("Company registered", "Close");
        console.log("RES FROM OBSERVABLE", res.company);
        this.companyStore.setCompany(res.company);
        this.isRegisterMode.set(false);
      },
      error: (err) => {
        console.error(err)
        this._snackbar.open(err.error.message, "Got it");
      }
    })
  }
}
