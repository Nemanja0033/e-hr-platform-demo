import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      <label *ngIf="label" class="text-sm font-semibold text-gray-700 ml-0.5">
        {{ label }}
      </label>
      
      <div class="relative flex items-center group">
        <input
          type="date"
          [value]="value"
          [disabled]="disabled"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          [class.border-red-500]="error"
          [class.focus:ring-red-200]="error"
          class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xs text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        />
        <div class="absolute right-4 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>

      <div *ngIf="error" class="min-h-[18px]">
        <span class="text-xs font-medium text-red-500 ml-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {{ error }}
        </span>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ],
  styles: [`
    ::-webkit-calendar-picker-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      cursor: pointer;
      opacity: 0;
    }
  `]
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() error: string | null = null;

  value: string = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value instanceof Date) {
      this.value = value.toISOString().split('T')[0];
    } else {
      this.value = value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
