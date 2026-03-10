import { TestBed } from '@angular/core/testing';
import { VacationReviewService } from './vacation-review.service';
import { of } from 'rxjs';
import { VacationReviewHttpService } from './http/vacation-review-http.service';

class MockVacationReviewHttpService {
  getVacationRequests = vi.fn().mockReturnValue(of({ vacationRequests: [{}, {}, {}], pages: 1 }));
  reviewVacationRequest = vi.fn().mockReturnValue(of({ message: "Success" }));
}

describe('VacationReviewService', () => {
  let service: VacationReviewService;
  let httpService: MockVacationReviewHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VacationReviewService,
        { provide: VacationReviewHttpService, useClass: MockVacationReviewHttpService }
      ]
    });
    service = TestBed.inject(VacationReviewService);
    httpService = TestBed.inject(VacationReviewHttpService) as unknown as MockVacationReviewHttpService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getVacationRequests should set loading true then false and update state', () => {
    const obs$ = service.getVacationRequests();

    expect(service.isLoading()).toBe(true);

    obs$.subscribe({
      next: () => {
        expect(httpService.getVacationRequests).toHaveBeenCalledWith({ page: 1, limit: 10 });
        expect(service.allPages()).toBe(1);
        expect(service.vacationRequestReviews()?.length).toBe(3);
      },
    });

    expect(service.isLoading()).toBe(false);
  });

  it('refetch should call external service and refetch data ', () => {
    service.refetch();
    expect(httpService.getVacationRequests).toBeCalled();
    expect(service.vacationRequestReviews()).toBeTruthy();
  })

  it('nextPage should increment page and update selectedPage', () => {
    service.nextPage();
    expect(service.selectedPage()).toBe(2);
  });

  it('reviewVacationRequest should call external service with reviewData object', () => {
    const reviewData = { id: 1, status: 'approved'};
    service.reviewVacationRequest(reviewData);
    expect(httpService.reviewVacationRequest).toBeCalledWith(reviewData);
  })

  it('insertRealtimeVacationRequests should push data to vacation review state', () => {
      const mockData = {id: 1, startDate: '11/12/26', endDate: '15/12/26'};
      service.insertRealtimeVacationRequests(mockData);
      expect(service.vacationRequestReviews).toBeTruthy();
  })
});
