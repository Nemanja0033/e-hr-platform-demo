import { effect, Injectable, signal } from '@angular/core';
import { debounceTime, finalize, Subscription, switchMap, tap } from 'rxjs';
import { VacationReviewHttpService } from './http/vacation-review-http.service';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class VacationReviewService {
  private subs = new Subscription();

  private _vacationRequestReviews = signal<any[] | null>(null);
  private _isLoading = signal<boolean>(false);
  private _queryParams = { page: 1, limit: 10 };
  private _allPages = signal<number[] | null>(null);
  private _selectedPage = signal(1);

  allPages = this._allPages.asReadonly();
  selectedPage = this._selectedPage.asReadonly();
  vacationRequestReviews = this._vacationRequestReviews.asReadonly();
  isLoading = this._isLoading.asReadonly();

  constructor(private vacationReviewHttpService: VacationReviewHttpService) {
    this.subs.add(
      toObservable(this._selectedPage).pipe(
        tap(() => {
          this._vacationRequestReviews.set([]);
          this._isLoading.set(true);
        }),
        debounceTime(300),
        switchMap(page => {
          return this.vacationReviewHttpService.getVacationRequests({ page, limit: this._queryParams.limit })
            .pipe(finalize(() => this._isLoading.set(false)))
        })
      ).subscribe((res: any) => {
        this._vacationRequestReviews.set(res.vacationRequests);
        this._allPages.set(res.pages);
      })
    )
  }

  getVacationRequests() {
    this._isLoading.set(true);
    return this.vacationReviewHttpService.getVacationRequests(this._queryParams).pipe(
      finalize(() => this._isLoading.set(false)),
      tap((res: any) => {
        this._vacationRequestReviews.set(res.vacationRequests);
        this._allPages.set(res.pages);
      })
    );
  }

  refetch(){
    this._vacationRequestReviews.set([]);
    this.getVacationRequests();
  }

  selectPage(page: number){
    this._queryParams.page = page;
    this._selectedPage.set(page);
  }

  nextPage(){
    this._queryParams.page++;
    this._selectedPage.set(this._queryParams.page);
  }

  pervPage(){
    this._queryParams.page--;
    this._selectedPage.set(this._queryParams.page);
  }

  reviewVacationRequest(reviewData: any) {
    return this.vacationReviewHttpService.reviewVacationRequest(reviewData);
  }

  insertRealtimeVacationRequests(data: any){
    this._vacationRequestReviews.update((perv: any) => [...perv, data]);
  }

  dispose(){
    this.subs.unsubscribe();
  }
}