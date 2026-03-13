import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { calculateDays } from '../helpers/helpers';

export function startDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as Date;
    if (value && value < new Date()) {
      return { invalidStartDate: true };
    }
    return null;
  };
}

export function endDateValidator(startControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const endDate = control.value as Date;
    const parent = control.parent;
    if (!endDate || !parent) return null;

    const startDate = parent.get(startControlName)?.value as Date;
    if (startDate && endDate < startDate) {
      return { invalidEndDate: true };
    }
    return null;
  };
}

export function vacationDaysValidator(employeeDays: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value as Date;
    const endDate = group.get('endDate')?.value as Date;

    console.log(startDate,  endDate, "DATES FORM VACATION VALIDATOR")

    if (startDate && endDate) {
      console.log("VALIDATION RUNS")
      const diff = calculateDays(endDate, startDate);
      if (diff > employeeDays) {
        console.log("VALIDATION WORKS")
        return { notEnoughDays: true };
      }
    }
    return null;
  };
}
