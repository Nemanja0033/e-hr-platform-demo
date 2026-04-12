import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div [class]="sizeClasses[size]" class="relative">
      <div class="w-full h-full border-2 border-primary/20 rounded-full"></div>
      <div class="absolute top-0 left-0 w-full h-full border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  `
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
}
