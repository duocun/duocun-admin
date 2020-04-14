import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverScheduleSettingsComponent } from './driver-schedule-settings.component';

describe('DriverScheduleSettingsComponent', () => {
  let component: DriverScheduleSettingsComponent;
  let fixture: ComponentFixture<DriverScheduleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverScheduleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverScheduleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
