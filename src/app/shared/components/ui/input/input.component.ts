import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      <label *ngIf="label" class="text-sm font-semibold text-gray-700 ml-0.5">
        {{ label }}
      </label>
      
      <div class="relative flex items-center">
        <ng-container *ngIf="type !== 'textarea'; else textareaTpl">
          <input
            [type]="type"
            [placeholder]="placeholder"
            [value]="value"
            [disabled]="disabled"
            (input)="onInputChange($event)"
            (blur)="onBlur()"
            [class.border-red-500]="error"
            [class.focus:ring-red-200]="error"
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xs text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </ng-container>

        <ng-template #textareaTpl>
          <textarea
            [placeholder]="placeholder"
            [value]="value"
            [disabled]="disabled"
            [rows]="rows"
            (input)="onInputChange($event)"
            (blur)="onBlur()"
            [class.border-red-500]="error"
            [class.focus:ring-red-200]="error"
            class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xs text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
          ></textarea>
        </ng-template>
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
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'textarea' = 'text';
  @Input() rows: number = 3;
  @Input() error: string | null = null;

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
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
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
