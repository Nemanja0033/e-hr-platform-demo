import { Component, signal } from '@angular/core';
import { CompanyInterface, CompanyStore } from '../../../core/store/company.store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'app-company',
  imports: [AsyncPipe, ReactiveFormsModule, MatFormField, MatInput, MatLabel],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
export class Company {
  company$: Observable<CompanyInterface | null>

  registerCompanyForm;
  isRegisterMode = signal<boolean>(false);

  constructor(private companyStore: CompanyStore, private fb: FormBuilder){
    this.company$ = companyStore.company$;
    this.registerCompanyForm = this.fb.nonNullable.group({
      company_name: ['', [Validators.required, Validators.minLength(2), Validators.minLength(45)]]
    })
  }

  toggleRegisterMode(){
    this.isRegisterMode.set(true);
  }
}
