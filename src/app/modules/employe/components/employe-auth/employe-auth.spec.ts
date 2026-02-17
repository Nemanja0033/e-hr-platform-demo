import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeAuth } from './employe-auth';

describe('EmployeAuth', () => {
  let component: EmployeAuth;
  let fixture: ComponentFixture<EmployeAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
