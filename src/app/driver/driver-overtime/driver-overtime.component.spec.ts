import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOvertimeComponent } from './driver-overtime.component';

describe('DriverOvertimeComponent', () => {
  let component: DriverOvertimeComponent;
  let fixture: ComponentFixture<DriverOvertimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverOvertimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
