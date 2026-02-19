import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { EmployeInterface, EmployeService } from '../../../core/services/employe/employe.service';
import { EmployeeStore } from '../../../core/store/employee.store';

@Component({
  selector: 'app-employes',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatLabel, MatInputModule, MatError],
  templateUrl: './employes.html',
  styleUrl: './employes.css',
})
export class Employes {
  employes$: Observable<EmployeInterface[] | null>;
  loading$: Observable<boolean | null>;

  registerEmployeeForm;
  isRegisterEmployeeMode = signal<boolean>(false);

  constructor(private fb: FormBuilder, private employesStore: EmployeeStore, private employeeService: EmployeService) {
    this.employes$ = employesStore.employes$;
    this.loading$ = employesStore.loading$;

    this.registerEmployeeForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', Validators.required, Validators.email],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]],
      role: ['', [Validators.required]],
    });
  }

  toggleRegisterMode() {
    this.isRegisterEmployeeMode.set(true);
  }

  onRegisterEmployeeSubmit(){
    if(this.registerEmployeeForm.invalid){
      this.registerEmployeeForm.markAllAsTouched();
      return;
    }

    this.employeeService.registerEmployee(this.registerEmployeeForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.employesStore.refetch();
        console.log("DONE", res)
      }
    })
  }
}
