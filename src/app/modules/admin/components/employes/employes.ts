import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-employes',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatLabel, MatInputModule, MatError],
  templateUrl: './employes.html',
  styleUrl: './employes.css',
})
export class Employes {
  registerEmployeeForm;
  isRegisterEmployeeMode = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
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
}
