import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStore } from '../../../../core/store/user.store';

@Component({
  selector: 'app-vacation-request',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './vacation-request.html',
  styleUrl: './vacation-request.css',
})
export class VacationRequest {
  isRequestMode = signal(false);
  vacationDateForm;
  employeeData;

  constructor(private fb: FormBuilder, private userStore: UserStore){
    this.employeeData = userStore.user;

    this.vacationDateForm = this.fb.nonNullable.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(new Date().setDate(new Date().getDate() + 20)), Validators.required]
    })
  }

  toggleRequestMode(){
    this.isRequestMode.set(true);
  }

  onRequestFormSubmit(){
    if(this.vacationDateForm.invalid){
      this.vacationDateForm.markAllAsTouched();
      console.log('invalid')
      return;
    }
    
    console.log("FORM DATA", this.vacationDateForm.getRawValue());
  }
}
