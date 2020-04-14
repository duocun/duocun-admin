import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverScheduleComponent } from './driver-schedule.component';

describe('DriverScheduleComponent', () => {
  let component: DriverScheduleComponent;
  let fixture: ComponentFixture<DriverScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
