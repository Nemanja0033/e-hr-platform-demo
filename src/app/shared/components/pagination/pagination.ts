import { Component, computed, Input, Output, EventEmitter } from '@angular/core';

@Component({  
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  @Input() pages: number[] = [];
  @Input() selectedPage: number = 0;
  @Output() slectPageChange = new EventEmitter<number>();
  @Output() nextPageChange = new EventEmitter<void>();
  @Output() pervPageChange = new EventEmitter<void>();

  onNextPageChange(){
    this.nextPageChange.emit();
  }

  onPervPageChange(){
    this.pervPageChange.emit();
  }

  onPageSelected(page: number){
    this.slectPageChange.emit(page);
  }
}
