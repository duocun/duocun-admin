import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSalaryComponent } from './driver-salary.component';

describe('DriverSalaryComponent', () => {
  let component: DriverSalaryComponent;
  let fixture: ComponentFixture<DriverSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
