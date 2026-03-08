import { Component, computed, input, OnInit, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({  
  selector: 'app-pagination',
  imports: [NgClass],
  templateUrl: './pagination.html',
})
export class Pagination {
  pages = input.required<number[]>();
  selectedPage = input.required<number>();
  slectPageChange = output<number>();
  nextPageChange = output<void>();
  pervPageChange = output<void>();

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
