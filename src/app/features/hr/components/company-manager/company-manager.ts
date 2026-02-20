import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { CompanyService } from '../../../../core/services/company/company.service';
import { CompanyInterface, CompanyStore } from '../../../../core/store/company.store';


@Component({
  selector: 'app-company-manager',
  imports: [AsyncPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './company-manager.html',
  styleUrl: './company-manager.css',
})
export class Company {
  // Use property for observable placeholder that we use in template. 
  // with async pipe to render (automate sub/unsub)
  company$: Observable<CompanyInterface | null>;
  loading$: Observable<boolean | null>;

  registerCompanyForm;

  // Using signal for handling UI state
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
