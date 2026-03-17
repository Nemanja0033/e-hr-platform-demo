import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../../../core/services/company.service';
import { IdPipe } from '../../../core/pipes/id-pipe';

@Component({
  selector: 'app-company-manager',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, IdPipe],
  templateUrl: './company-manager.component.html',
})
export class CompanyManagerComponent implements OnInit {
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

  ngOnInit(): void {
    this.companyService.getCompanyData().subscribe()
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
        this.companyService.refetch();
        this.isRegisterMode.set(false);
      },
      error: (err) => {
        console.error(err)
        this._snackbar.open(err.error.message, "Got it");
      }
    })
  }
}
