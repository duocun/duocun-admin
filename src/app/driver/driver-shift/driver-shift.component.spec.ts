import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverShiftComponent } from './driver-shift.component';

describe('DriverShiftComponent', () => {
  let component: DriverShiftComponent;
  let fixture: ComponentFixture<DriverShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
