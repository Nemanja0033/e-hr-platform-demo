import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationReview } from './vacation-review';

describe('VacationReview', () => {
  let component: VacationReview;
  let fixture: ComponentFixture<VacationReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacationReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacationReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
