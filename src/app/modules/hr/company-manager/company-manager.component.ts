import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from '../services/company.service';
import { ToastService } from '../../../shared/services/ui/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-company-manager',
  templateUrl: './company-manager.component.html',
})
export class CompanyManagerComponent implements OnInit {
  company$: Observable<any>;
  loading$: Observable<boolean>;
  
  isRegisterMode: boolean = false;
  registerCompanyForm;

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.company$ = companyService.company$;
    this.loading$ = companyService.loading$;
    
    this.registerCompanyForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
    });
  }

  ngOnInit(): void {
    this.companyService.getCompanyData().subscribe();
  }

  toggleRegisterMode() {
    this.isRegisterMode = true;
  }

  onSubmitCompanyRegister() {
    if (this.registerCompanyForm.invalid) {
      this.registerCompanyForm.markAllAsTouched();
      return;
    }

    this.companyService.registerCompany(this.registerCompanyForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.toastService.open("Company registered", "success");
        this.companyService.refetch();
        this.isRegisterMode = false;
      },
      error: (err) => {
        this.toastService.open(err.error?.message ?? "Registration failed", "error");
      }
    })
  }
}
