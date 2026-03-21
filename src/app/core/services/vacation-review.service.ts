import { Injectable, inject, signal, computed } from '@angular/core';
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
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { VacationReviewHttpService } from './http/vacation-review-http.service';
import { WebSocketService } from './ws/webSocket.service';

@Injectable({ providedIn: 'root' })
export class VacationReviewService {
  private http = inject(VacationReviewHttpService);
  private ws = inject(WebSocketService);

  private _serachTerm = signal('');
  private _selectedPage = signal(1);
  private _refetch$ = new Subject<void>();
  private _isLoading = signal(false);
  private newRequests$ = this.ws.on('vacationRequest:new');

  private dataStream$ = merge(
    toObservable(this._selectedPage),
    toObservable(this._serachTerm),
    this._refetch$
  ).pipe(
    tap(() => {
      this._isLoading.set(true);
    }),
    switchMap(() =>
      this.http.getVacationRequests({
        page: this._selectedPage(),
        limit: 5,
        searchTerm: this._serachTerm(),
      })
    ),
    catchError((err) => {
      console.log('error', err);
      return of(null);
    }),
    tap(() => this._isLoading.set(false)),
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
    )
  );

  state = toSignal(this.finalState$);
  vacationRequestReviews = computed(() => this.state()?.vacationRequests ?? []);
  allPages = computed(() => this.state()?.pages ?? []);
  isLoading = this._isLoading.asReadonly();
  selectedPage = this._selectedPage.asReadonly();

  selectPage(page: number) {
    this._selectedPage.set(page);
  }

  toggleSearch(term: string) {
    this._serachTerm.set(term);
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
