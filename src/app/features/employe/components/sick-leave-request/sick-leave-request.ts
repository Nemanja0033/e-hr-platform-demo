import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sick-leave-request',
  imports: [MatProgressSpinnerModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './sick-leave-request.html',
  styleUrl: './sick-leave-request.css',
})
export class SickLeaveRequest implements OnInit {
  sickLeaveRequestForm!: FormGroup;
  isLoading = signal(false);
  sickLeaveRequestData = signal([]);
  isRequestMode = signal(false);

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.sickLeaveRequestForm = this.fb.nonNullable.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      sickType: [''],
      reason: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(250)]]
    })
  }

  ngOnDestroy() {

  }

  toggleRequestMode() {
    this.isRequestMode.set(true);
  }

  onRequestFormSubmit() {
    console.log('submitted');
    console.log(this.sickLeaveRequestForm.valid);
    console.log(this.sickLeaveRequestForm.value);
  }
}
