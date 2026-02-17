import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeDashboard } from './employe-dashboard';

describe('EmployeDashboard', () => {
  let component: EmployeDashboard;
  let fixture: ComponentFixture<EmployeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
