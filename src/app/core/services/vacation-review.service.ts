import { Injectable, inject, signal, computed } from '@angular/core';
import { debounceTime, map, scan, shareReplay, startWith, switchMap, tap, merge, Subject } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { VacationReviewHttpService } from './http/vacation-review-http.service';
import { WebSocketService } from './ws/webSocket.service';

@Injectable({ providedIn: 'root' })
export class VacationReviewService {
  private http = inject(VacationReviewHttpService);
  private ws = inject(WebSocketService);

  private _selectedPage = signal(1);
  private _refetch$ = new Subject<void>();
  private _isLoading = signal(false);

  private newRequests$ = this.ws.on("vacationRequest:new");

  private dataStream$ = merge(
    toObservable(this._selectedPage), 
    this._refetch$
  ).pipe(
    debounceTime(100),
    tap(() => {
      this._isLoading.set(true);
    }),
    switchMap(() => this.http.getVacationRequests({ page: this._selectedPage(), limit: 5 })),
    tap(() => this._isLoading.set(false)),
    shareReplay(1) 
  );

  private finalState$ = merge(
    this.dataStream$.pipe(map(res => ({ type: 'SET', payload: res }))),
    this.newRequests$.pipe(map(req => ({ type: 'ADD', payload: req })))
  ).pipe(
    scan((state: any, action: any) => {
      if (action.type === 'SET') return action.payload;
      return { 
        ...state, 
        vacationRequests: [...state.vacationRequests, action.payload] 
      };
    }, { vacationRequests: [], pages: [] })
  );

  state = toSignal(this.finalState$);
  vacationRequestReviews = computed(() => this.state()?.vacationRequests ?? []);
  allPages = computed(() => this.state()?.pages ?? []);
  isLoading = this._isLoading.asReadonly();
  selectedPage = this._selectedPage.asReadonly();

  selectPage(page: number) { this._selectedPage.set(page); }
  
  refetch() { this._refetch$.next(); }
  
  reviewVacationRequest(reviewData: any) {
    return this.http.reviewVacationRequest(reviewData);
  }
}