import { Component, inject } from '@angular/core';
import { ToastService, Toast } from '../../../services/ui/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <ng-container *ngFor="let toast of toasts$ | async; trackBy: trackByFn">
        <div 
          [ngClass]="{
            'bg-green-50 border-green-100 text-green-800': toast.type === 'success',
            'bg-red-50 border-red-100 text-red-800': toast.type === 'error',
            'bg-blue-50 border-blue-100 text-blue-800': toast.type === 'info'
          }"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-md border shadow-lg min-w-[300px] animate-in slide-in-from-right duration-300"
        >
          <div [ngClass]="{
            'text-green-500': toast.type === 'success',
            'text-red-500': toast.type === 'error',
            'text-blue-500': toast.type === 'info'
          }">
            <!-- Success Icon -->
            <svg *ngIf="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            
            <!-- Error Icon -->
            <svg *ngIf="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            
            <!-- Info Icon -->
            <svg *ngIf="toast.type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          
          <span class="text-sm font-medium">{{ toast.message }}</span>
          
          <button (click)="remove(toast.id)" class="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </ng-container>
    </div>
  `
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  trackByFn(index: number, toast: Toast) {
    return toast.id;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
