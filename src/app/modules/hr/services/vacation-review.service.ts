import { Injectable, inject } from '@angular/core';
import {
  debounceTime,
  map,
  scan,
  shareReplay,
  startWith,
  switchMap,
  tap,
  merge,
  Subject,
  catchError,
  of,
  forkJoin,
  BehaviorSubject,
  Observable,
  combineLatest
} from 'rxjs';
import { VacationReviewHttpService } from './vacation-review-http.service';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';

@Injectable()
export class VacationReviewService {
  private http = inject(VacationReviewHttpService);
  private ws = inject(WebSocketService);

  private _serachTerm$ = new BehaviorSubject<string>('');
  private _selectedPage$ = new BehaviorSubject<number>(1);
  private _refetch$ = new Subject<void>();
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private newRequests$ = this.ws.on('vacationRequest:new');

  private dataStream$ = merge(
    this._selectedPage$,
    this._serachTerm$,
    this._refetch$.pipe(map(() => this._selectedPage$.value))
  ).pipe(
    debounceTime(100), // Small debounce to avoid multiple calls if multiple subjects fire
    tap(() => {
      this._isLoading$.next(true);
    }),
    switchMap(() =>
      this.http.getVacationRequests({
        page: this._selectedPage$.value,
        limit: 5,
        searchTerm: this._serachTerm$.value,
      })
    ),
    catchError((err) => {
      console.log('error', err);
      return of({ vacationRequests: [], pages: [] });
    }),
    tap(() => this._isLoading$.next(false)),
    shareReplay(1)
  );

  private finalState$ = merge(
    this.dataStream$.pipe(map((res) => ({ type: 'SET', payload: res }))),
    this.newRequests$.pipe(map((req) => ({ type: 'ADD', payload: req })))
  ).pipe(
    scan(
      (state: any, action: any) => {
        if (action.type === 'SET') return action.payload;
        return {
          ...state,
          vacationRequests: [...state.vacationRequests, action.payload],
        };
      },
      { vacationRequests: [], pages: [] }
    ),
    shareReplay(1)
  );

  vacationRequestReviews$ = this.finalState$.pipe(map(state => state?.vacationRequests ?? []));
  allPages$ = this.finalState$.pipe(map(state => state?.pages ?? []));
  isLoading$ = this._isLoading$.asObservable();
  selectedPage$ = this._selectedPage$.asObservable();

  selectPage(page: number) {
    this._selectedPage$.next(page);
  }

  toggleSearch(term: string) {
    this._serachTerm$.next(term);
  }

  refetch() {
    this._refetch$.next();
  }

  reviewVacationRequest(reviewData: any) {
    return this.http.reviewVacationRequest(reviewData);
  }

  approveAllVacationRequest(approveData: {
    status: 'approved';
    requestId: string;
    employeeId: string;
    requestedDays: number;
  }[]) {
    const requestsToApprove = approveData.map(req => this.reviewVacationRequest(req).pipe(
      catchError(err => of({ error: true, id: req.requestId}))
    ));

    return forkJoin(requestsToApprove).pipe(
      tap((results) => {
        const failed = results.filter((r: any) => r?.error).length;
        if(failed > 0 && failed < approveData.length){
          alert(`Approved but ${failed} has failed`)
        }
        if(failed === 0){
          alert("All approved")
        }
        if(failed === approveData.length){
          alert("all failed")
        }
      })
    )
  }
}
